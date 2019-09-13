
package org.spiderflow.core.expression.interpreter;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class JavaReflection extends Reflection {
	@SuppressWarnings("rawtypes") private final Map<Class, Map<String, Field>> fieldCache = new ConcurrentHashMap<Class, Map<String, Field>>();
	@SuppressWarnings("rawtypes") private final Map<Class, Map<JavaReflection.MethodSignature, Method>> methodCache = new ConcurrentHashMap<Class, Map<JavaReflection.MethodSignature, Method>>();

	@SuppressWarnings("rawtypes")
	@Override
	public Object getField (Object obj, String name) {
		Class cls = obj instanceof Class ? (Class)obj : obj.getClass();
		Map<String, Field> fields = fieldCache.get(cls);
		if (fields == null) {
			fields = new ConcurrentHashMap<String, Field>();
			fieldCache.put(cls, fields);
		}

		Field field = fields.get(name);
		if (field == null) {
			try {
				field = cls.getDeclaredField(name);
				field.setAccessible(true);
				fields.put(name, field);
			} catch (Throwable t) {
				// fall through, try super classes
			}

			if (field == null) {
				Class parentClass = cls.getSuperclass();
				while (parentClass != Object.class && parentClass != null) {
					try {
						field = parentClass.getDeclaredField(name);
						field.setAccessible(true);
						fields.put(name, field);
					} catch (NoSuchFieldException e) {
						// fall through
					}
					parentClass = parentClass.getSuperclass();
				}
			}
		}

		return field;
	}

	@Override
	public Object getFieldValue (Object obj, Object field) {
		Field javaField = (Field)field;
		try {
			return javaField.get(obj);
		} catch (Throwable e) {
			throw new RuntimeException("Couldn't get value of field '" + javaField.getName() + "' from object of type '" + obj.getClass().getSimpleName() + "'");
		}
	}

	@Override
	public Object getMethod (Object obj, String name, Object... arguments) {
		Class<?> cls = obj instanceof Class ? (Class<?>)obj : obj.getClass();
		Map<JavaReflection.MethodSignature, Method> methods = methodCache.get(cls);
		if (methods == null) {
			methods = new ConcurrentHashMap<JavaReflection.MethodSignature, Method>();
			methodCache.put(cls, methods);
		}

		Class<?>[] parameterTypes = new Class[arguments.length];
		for (int i = 0; i < arguments.length; i++) {
			parameterTypes[i] = arguments[i] == null ? Object.class : arguments[i].getClass();
		}

		JavaReflection.MethodSignature signature = new MethodSignature(name, parameterTypes);
		Method method = methods.get(signature);

		if (method == null) {
			try {
				if (name == null) {
					method = findApply(cls);
				} else {
					method = findMethod(cls, name, parameterTypes);
					if(method == null && parameterTypes != null){
						method = findMethod(cls, name, new Class<?>[]{Object[].class});
					}
				}
				method.setAccessible(true);
				methods.put(signature, method);
			} catch (Throwable e) {
				// fall through
			}

			if (method == null) {
				Class<?> parentClass = cls.getSuperclass();
				while (parentClass != Object.class && parentClass != null) {
					try {
						if (name == null)
							method = findApply(parentClass);
						else {
							method = findMethod(parentClass, name, parameterTypes);
						}
						method.setAccessible(true);
						methods.put(signature, method);
					} catch (Throwable e) {
						// fall through
					}
					parentClass = parentClass.getSuperclass();
				}
			}
		}

		return method;
	}

	/** Returns the <code>apply()</code> method of a functional interface. **/
	private static Method findApply (Class<?> cls) {
		for (Method method : cls.getDeclaredMethods()) {
			if (method.getName().equals("apply")) return method;
		}
		return null;
	}

	/** Returns the method best matching the given signature, including type coercion, or null. **/
	private static Method findMethod (Class<?> cls, String name, Class<?>[] parameterTypes) {
		Method[] methods = cls.getDeclaredMethods();
		Method foundMethod = null;
		int foundScore = 0;
		for (int i = 0, n = methods.length; i < n; i++) {
			Method method = methods[i];

			// if neither name or parameter list size match, bail on this method
			if (!method.getName().equals(name)) continue;
			if (method.getParameterTypes().length != parameterTypes.length) continue;

			// Check if the types match.
			Class<?>[] otherTypes = method.getParameterTypes();
			boolean match = true;
			int score = 0;
			for (int ii = 0, nn = parameterTypes.length; ii < nn; ii++) {
				Class<?> type = parameterTypes[ii];
				Class<?> otherType = otherTypes[ii];

				if (!otherType.isAssignableFrom(type)) {
					score++;
					if (!isPrimitiveAssignableFrom(type, otherType)) {
						score++;
						if (!isCoercible(type, otherType)) {
							match = false;
							break;
						} else {
							score++;
						}
					}
				}
			}
			if (match) {
				if (foundMethod == null) {
					foundMethod = method;
					foundScore = score;
				} else {
					if (score < foundScore) {
						foundScore = score;
						foundMethod = method;
					}
				}
			}
		}
		return foundMethod;
	}

	/** Returns whether the from type can be assigned to the to type, assuming either type is a (boxed) primitive type. We can
	 * relax the type constraint a little, as we'll invoke a method via reflection. That means the from type will always be boxed,
	 * as the {@link Method#invoke(Object, Object...)} method takes objects. **/
	private static boolean isPrimitiveAssignableFrom (Class<?> from, Class<?> to) {
		if ((from == Boolean.class || from == boolean.class) && (to == boolean.class || to == Boolean.class)) return true;
		if ((from == Integer.class || from == int.class) && (to == int.class || to == Integer.class)) return true;
		if ((from == Float.class || from == float.class) && (to == float.class || to == Float.class)) return true;
		if ((from == Double.class || from == double.class) && (to == double.class || to == Double.class)) return true;
		if ((from == Byte.class || from == byte.class) && (to == byte.class || to == Byte.class)) return true;
		if ((from == Short.class || from == short.class) && (to == short.class || to == Short.class)) return true;
		if ((from == Long.class || from == long.class) && (to == long.class || to == Long.class)) return true;
		if ((from == Character.class || from == char.class) && (to == char.class || to == Character.class)) return true;
		return false;
	}

	/** Returns whether the from type can be coerced to the to type. The coercion rules follow those of Java. See JLS 5.1.2
	 * https://docs.oracle.com/javase/specs/jls/se7/html/jls-5.html **/
	private static boolean isCoercible (Class<?> from, Class<?> to) {
		if (from == Integer.class || from == int.class) {
			return to == float.class || to == Float.class || to == double.class || to == Double.class || to == long.class || to == Long.class;
		}

		if (from == Float.class || from == float.class) {
			return to == double.class || to == Double.class;
		}

		if (from == Double.class || from == double.class) {
			return false;
		}

		if (from == Character.class || from == char.class) {
			return to == int.class || to == Integer.class || to == float.class || to == Float.class || to == double.class || to == Double.class || to == long.class
				|| to == Long.class;
		}

		if (from == Byte.class || from == byte.class) {
			return to == int.class || to == Integer.class || to == float.class || to == Float.class || to == double.class || to == Double.class || to == long.class
				|| to == Long.class || to == short.class || to == Short.class;
		}

		if (from == Short.class || from == short.class) {
			return to == int.class || to == Integer.class || to == float.class || to == Float.class || to == double.class || to == Double.class || to == long.class
				|| to == Long.class;
		}

		if (from == Long.class || from == long.class) {
			return to == float.class || to == Float.class || to == double.class || to == Double.class;
		}

		return false;
	}

	@Override
	public Object callMethod (Object obj, Object method, Object... arguments) {
		Method javaMethod = (Method)method;
		try {
			return javaMethod.invoke(obj, arguments);
		} catch (Throwable t) {
			throw new RuntimeException("Couldn't call method '" + javaMethod.getName() + "' with arguments '" + Arrays.toString(arguments)
				+ "' on object of type '" + obj.getClass().getSimpleName() + "'.", t);
		}
	}

	private static class MethodSignature {
		private final String name;
		@SuppressWarnings("rawtypes") private final Class[] parameters;
		private final int hashCode;

		@SuppressWarnings("rawtypes")
		public MethodSignature (String name, Class[] parameters) {
			this.name = name;
			this.parameters = parameters;
			final int prime = 31;
			int hash = 1;
			hash = prime * hash + ((name == null) ? 0 : name.hashCode());
			hash = prime * hash + Arrays.hashCode(parameters);
			hashCode = hash;
		}

		@Override
		public int hashCode () {
			return hashCode;
		}

		@Override
		public boolean equals (Object obj) {
			if (this == obj) return true;
			if (obj == null) return false;
			if (getClass() != obj.getClass()) return false;
			JavaReflection.MethodSignature other = (JavaReflection.MethodSignature)obj;
			if (name == null) {
				if (other.name != null) return false;
			} else if (!name.equals(other.name)) return false;
			if (!Arrays.equals(parameters, other.parameters)) return false;
			return true;
		}
	}
}
