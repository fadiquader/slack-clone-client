export function normalizeError (errors=[]) {
    return errors.reduce((acc, cv) => {
        if(typeof acc[cv.path] === 'undefined') acc[cv.path] = [];
        acc[cv.path].push(cv.message);
        return acc;
    }, {})
}