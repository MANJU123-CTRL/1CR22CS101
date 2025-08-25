const forward = (level, event, data) => {
 
};

export const logInfo = (event, data) => forward("info", event, data);
export const logWarn = (event, data) => forward("warn", event, data);
export const logError = (event, data) => forward("error", event, data);
