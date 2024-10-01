export function categorizeItems(items) {
    return items.reduce((acc, item) => {
        // Check if the category already exists as a key in the accumulator
        if (!acc[item.category]) {
            acc[item.category] = []; // If not, create an array for that category
        }
        acc[item.category].push({...item, dueDate: item.dueDate.toString()}); // Add the item to the appropriate category
        return acc;
    }, {});
}

