const serializeFields = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export default serializeFields;
