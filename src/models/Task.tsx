/**
 * Model class to represent Task object
 */
export class Task {
    id: string = "";
    title: string = '';
    description: string = '';

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.id) this.id = initializer.id;
        if (initializer.title) this.title = initializer.title;
        if (initializer.description) this.description = initializer.description;
      }
}