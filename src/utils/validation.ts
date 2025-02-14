export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isAlphabetic = (str: string): boolean => {
    const alphaRegex = /^[A-Za-z]+$/;
    return alphaRegex.test(str);
};
