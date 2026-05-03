export const getMediumSizeImage = (url) => {
    if (url) {
        const lastIndex = url.lastIndexOf('.')
        if (lastIndex > 0) {
            // split by '.'
            let firstPart = url.substring(0, lastIndex);
            const secondPart = url.substring(lastIndex);
            const lastChar = firstPart.slice(-1);
            if (lastChar == "s") {
                const result = firstPart.slice(0, -1) + 'c' + secondPart;   // gives medium sized image
                return result;
            }
        }
    }
    return url;
}

export const truncate = (str, len) => {
    return str.length > len ? str.slice(0, len) + "..." : str;
};