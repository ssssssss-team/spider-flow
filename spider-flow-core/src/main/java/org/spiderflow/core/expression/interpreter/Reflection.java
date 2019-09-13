
package org.spiderflow.core.expression.interpreter;

/** Used by {@link AstInterpreter} to access fields and methods of objects. This is a singleton class used by all
 * {@link AstInterpreter} instances. Replace the default implementation via {@link #setInstance(Reflection)}. The implementation
 * must be thread-safe. */
public abstract class Reflection {
	private static Reflection instance = new JavaReflection();

	/** Sets the Reflection instance to be used by all Template interpreters **/
	public synchronized static void setInstance (Reflection reflection) {
		instance = reflection;
	}

	/** Returns the Reflection instance used to fetch field and call methods **/
	public synchronized static Reflection getInstance () {
		return instance;
	}

	/** Returns an opaque handle to a field with the given name or null if the field could not be found **/
	public abstract Object getField (Object obj, String name);

	/** Returns an opaque handle to the method with the given name best matching the signature implied by the given arguments, or
	 * null if the method could not be found. If obj is an instance of Class, the matching static method is returned. If the name
	 * is null and the object is a {@link FunctionalInterface}, the first declared method on the object is returned. **/
	public abstract Object getMethod (Object obj, String name, Object... arguments);

	/** Returns the value of the field from the object. The field must have been previously retrieved via
	 * {@link #getField(Object, String)}. **/
	public abstract Object getFieldValue (Object obj, Object field);

	/** Calls the method on the object with the given arguments. The method must have been previously retrieved via
	 * {@link #getMethod(Object, String, Object...)}. **/
	public abstract Object callMethod (Object obj, Object method, Object... arguments);
}
