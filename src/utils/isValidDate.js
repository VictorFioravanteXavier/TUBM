module.exports = (value) => {
    if (!value) return false;

    const date = new Date(value);

    return (
        date instanceof Date &&
        !isNaN(date.getTime())
    );
}