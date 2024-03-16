export const compareArrays = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false
    if (arr1)
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false
    }
    return true
}