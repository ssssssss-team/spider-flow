package org.spiderflow.core.expression.parsing;

import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.util.*;
import java.util.function.Function;
import java.util.stream.IntStream;

public class ArrayLikeLambdaExecutor {

    public static final Set<String> SUPPORT_METHOD;
    public static final Map<String, Method> METHODS;


    static {
        Map<String, Method> temp = new HashMap<>();
        Set<String> set = new HashSet<>();
        addSupport(temp, set, "map");
        addSupport(temp, set, "filter");
        addSupport(temp, set, "reduce");
        addSupport(temp, set, "sort");
        addSupport(temp, set, "every");
        addSupport(temp, set, "some");
        addSupport(temp, set, "distinct");
        SUPPORT_METHOD = Collections.unmodifiableSet(set);
        METHODS = Collections.unmodifiableMap(temp);
    }

    private static void addSupport(Map<String, Method> temp, Set<String> set, String name) {
        set.add(name);
        addMethod(temp, name);
    }

    private static void addMethod(Map<String, Method> initialMap, String name) {
        try {
            initialMap.put(name, ArrayLikeLambdaExecutor.class.getMethod(name, Object.class, Object[].class));
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
            throw new LambdaExecuteException(e);
        }
    }

    private static Object toOriginType(Object arrayLike, List<Object> results) {
        if (arrayLike instanceof Collection) {
            return results;
        } else if (arrayLike.getClass().isArray()) {
            return results.toArray();
        } else if (arrayLike instanceof Iterator) {
            return results;
        } else if (arrayLike instanceof Enumeration) {
            return results;
        }
        return null;
    }

    private static List<Object> arrayLikeToList(Object arrayLike) {
        if (arrayLike instanceof Collection) {
            return new ArrayList<>((Collection<?>) arrayLike);
        } else if (arrayLike.getClass().isArray()) {
            List<Object> list = new ArrayList<>(Array.getLength(arrayLike));
            IntStream.range(0, Array.getLength(arrayLike)).forEach(i->list.add(Array.get(arrayLike, i)));
            return list;
        } else if (arrayLike instanceof Iterator) {
            List<Object> list = new ArrayList<>();
            Iterator<Object> it = (Iterator<Object>) arrayLike;
            it.forEachRemaining(list::add);
            return list;
        } else if (arrayLike instanceof Enumeration) {
            Enumeration<Object> en = (Enumeration<Object>) arrayLike;
            return Collections.list(en);
        }
        throw new LambdaExecuteException("未实现");
    }

    @SuppressWarnings("unchecked")
    public static Object sort(Object arrayLike, Object... arguments) {
        List<Object> results = null;
        MultipleArgumentsLambda mal = (MultipleArgumentsLambda) arguments[0];
        Function<Object[], Object> handler = mal.getHandler();
        List<Object> coll = arrayLikeToList(arrayLike);
        if (coll.isEmpty() || coll.size() == 1) {
            return toOriginType(arrayLike, coll);
        }
        coll.sort((o1, o2) -> {
            Object val = handler.apply(new Object[]{o1, o2});
            if (!(val instanceof Integer)) {
                throw new IllegalStateException("lambda 函数 sort 必须返回int类型结果");
            }
            return (Integer) val;
        });
        return toOriginType(arrayLike, coll);
    }


    @SuppressWarnings("unchecked")
    public static Object reduce(Object arrayLike, Object... arguments) {
        MultipleArgumentsLambda mal = (MultipleArgumentsLambda) arguments[0];
        Function<Object[], Object> handler = mal.getHandler();
        List<?> coll = arrayLikeToList(arrayLike);
        if (coll.isEmpty()) {
            return null;
        }
        if (coll.size() == 1) {
            return coll.get(0);
        }
        Object result = coll.get(0);
        for (int i = 1; i < coll.size(); i++) {
            result = handler.apply(new Object[]{result, coll.get(i)});
        }
        return result;
    }

    @SuppressWarnings("unchecked")
    public static Object map(Object arrayLike, Object... arguments) {
        MultipleArgumentsLambda mal = (MultipleArgumentsLambda) arguments[0];
        Function<Object[], Object> handler = mal.getHandler();
        List<Object> coll = arrayLikeToList(arrayLike);
        List<Object> results = new ArrayList<>(coll.size());
        List<Object> args = new ArrayList<>(2);
        for (int i = 0; i < coll.size(); i++) {
            Object obj = coll.get(i);
            args.clear();
            args.add(obj);
            if (mal.getArgs().size() > 1) {
                args.add(i);
            }
            results.add(handler.apply(args.toArray()));
        }
        return toOriginType(arrayLike, results);
    }

    @SuppressWarnings("unchecked")
    public static Object filter(Object arrayLike, Object... arguments) {
        MultipleArgumentsLambda mal = (MultipleArgumentsLambda) arguments[0];
        Function<Object[], Object> handler = mal.getHandler();
        List<Object> coll = arrayLikeToList(arrayLike);
        List<Object> results = new ArrayList<>(coll.size());
        List<Object> args = new ArrayList<>(2);
        for (int i = 0; i < coll.size(); i++) {
            Object obj = coll.get(i);
            args.clear();
            args.add(obj);
            if (mal.getArgs().size() > 1) {
                args.add(i);
            }
            Object result = handler.apply(args.toArray());
            if (!(result instanceof Boolean)) {
                throw new LambdaExecuteException("lambda函数 filter 的结果非布尔类型");
            }
            if ((Boolean) result) {
                results.add(obj);
            }
        }
        return toOriginType(arrayLike, results);
    }

    @SuppressWarnings("unchecked")
    public static Object distinct(Object arrayLike, Object... arguments) {
        MultipleArgumentsLambda mal = (MultipleArgumentsLambda) arguments[0];
        Function<Object[], Object> handler = mal.getHandler();
        List<Object> coll = arrayLikeToList(arrayLike);
        List<Object> args = new ArrayList<>(2);
        Map<Object, Object> map = new LinkedHashMap<>(coll.size());
        for (int i = 0; i < coll.size(); i++) {
            Object obj = coll.get(i);
            args.clear();
            args.add(obj);
            if (mal.getArgs().size() > 1) {
                args.add(i);
            }
            Object result = handler.apply(args.toArray());
            if (!map.containsKey(result)) {
                map.put(result, obj);
            }
        }
        return toOriginType(arrayLike, new ArrayList<>(map.values()));
    }


    @SuppressWarnings("unchecked")
    public static Object every(Object arrayLike, Object... arguments) {
        MultipleArgumentsLambda mal = (MultipleArgumentsLambda) arguments[0];
        Function<Object[], Object> handler = mal.getHandler();
        List<Object> coll = arrayLikeToList(arrayLike);
        List<Object> args = new ArrayList<>(2);
        for (int i = 0; i < coll.size(); i++) {
            Object obj = coll.get(i);
            args.clear();
            args.add(obj);
            if (mal.getArgs().size() > 1) {
                args.add(i);
            }
            Object result = handler.apply(args.toArray());
            if (!(result instanceof Boolean)) {
                throw new LambdaExecuteException("lambda函数 every 的结果非布尔类型");
            }
            if ( !(Boolean)result ) {
                return Boolean.FALSE;
            }
        }
        return Boolean.TRUE;
    }

    @SuppressWarnings("unchecked")
    public static Object some(Object arrayLike, Object... arguments) {
        MultipleArgumentsLambda mal = (MultipleArgumentsLambda) arguments[0];
        Function<Object[], Object> handler = mal.getHandler();
        List<Object> coll = arrayLikeToList(arrayLike);
        List<Object> args = new ArrayList<>(2);
        for (int i = 0; i < coll.size(); i++) {
            Object obj = coll.get(i);
            args.clear();
            args.add(obj);
            if (mal.getArgs().size() > 1) {
                args.add(i);
            }
            Object result = handler.apply(args.toArray());
            if (!(result instanceof Boolean)) {
                throw new LambdaExecuteException("lambda函数 some 的结果非布尔类型");
            }
            if ( (Boolean)result ) {
                return Boolean.TRUE;
            }
        }
        return Boolean.FALSE;
    }

    public static class MultipleArgumentsLambda {
        private List<Ast.Expression> args;
        private Function<Object[], Object> handler;

        public MultipleArgumentsLambda(Function<Object[], Object> handler) {
            this.handler = handler;
        }
        public MultipleArgumentsLambda(List<Ast.Expression> args, Function<Object[], Object> handler) {
            this.args = args;
            this.handler = handler;
        }

        public List<Ast.Expression> getArgs() {
            return args;
        }

        public void setArgs(List<Ast.Expression> args) {
            this.args = args;
        }

        public Function<Object[], Object> getHandler() {
            return handler;
        }

        public void setHandler(Function<Object[], Object> handler) {
            this.handler = handler;
        }
    }

    public static class LambdaExecuteException extends RuntimeException{
        private int argumentIndex;

        public int getArgumentIndex() {
            return argumentIndex;
        }

        public void setArgumentIndex(int argumentIndex) {
            this.argumentIndex = argumentIndex;
        }

        public LambdaExecuteException() {
            super();
        }

        public LambdaExecuteException(String message) {
            super(message);
        }

        public LambdaExecuteException(String message, Throwable cause) {
            super(message, cause);
        }

        public LambdaExecuteException(Throwable cause) {
            super(cause);
        }

        protected LambdaExecuteException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
            super(message, cause, enableSuppression, writableStackTrace);
        }
    }
}
