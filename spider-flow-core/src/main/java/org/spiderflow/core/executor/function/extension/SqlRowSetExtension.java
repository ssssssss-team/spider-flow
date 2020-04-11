package org.spiderflow.core.executor.function.extension;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.spiderflow.annotation.Example;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class SqlRowSetExtension implements FunctionExtension {
    public static Map<String, String[]> tableMetaMap = new HashMap<>();

    @Override
    public Class<?> support() {
        return SqlRowSet.class;
    }

    @Example("${rs.nextToMap()}")
    public static Map<String, Object> nextToMap(SqlRowSet sqlRowSet) {
        try {
            if (!sqlRowSet.next()) {
                return null;
            }
            String[] columnNames = sqlRowSet.getMetaData().getColumnNames();
            Map<String, Object> result = new HashMap<>();
            for (String columnName : columnNames) {
                result.put(columnName, sqlRowSet.getObject(columnName));
            }
            return result;
        } catch (Exception e) {
            ExceptionUtils.wrapAndThrow(e);
        }
        return null;
    }


}
