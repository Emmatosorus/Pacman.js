export function compArray(array1, array2)
{
    if (array1.length !== array2.length)
    {
        return false
    }
    for (let nb of array1)
    {
        if (!array2.includes(nb))
        {
            return false
        }
    }
    return true
}