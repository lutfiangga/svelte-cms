export class CrudState<T = any> {
    showCreate = $state(false);
    showEdit = $state(false);
    showDelete = $state(false);
    editItem = $state<T | null>(null);
    deleteItem = $state<T | null>(null);

    openCreate = () => {
        this.showCreate = true;
    };

    openEdit = (item: T) => {
        this.editItem = item;
        this.showEdit = true;
    };

    openDelete = (item: T) => {
        this.deleteItem = item;
        this.showDelete = true;
    };

    closeCreate = () => {
        this.showCreate = false;
    };

    closeEdit = () => {
        this.showEdit = false;
        this.editItem = null;
    };

    closeDelete = () => {
        this.showDelete = false;
        this.deleteItem = null;
    };
}
