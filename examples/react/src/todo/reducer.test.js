import { todoReducer, migrateTodos } from './reducer';
import { ADD_ITEM, REORDER_TODOS, REMOVE_ITEM, REMOVE_COMPLETED_ITEMS } from './constants';

describe('todoReducer', () => {
    describe('ADD_ITEM', () => {
        it('should add new item with order at the end', () => {
            const state = [
                { id: '1', title: 'Task 1', completed: false, order: 0 },
                { id: '2', title: 'Task 2', completed: false, order: 1 }
            ];
            
            const action = { type: ADD_ITEM, payload: { title: 'Task 3' } };
            const result = todoReducer(state, action);
            
            expect(result).toHaveLength(3);
            expect(result[2].title).toBe('Task 3');
            expect(result[2].order).toBe(2);
        });
        
        it('should add first item with order 0', () => {
            const state = [];
            const action = { type: ADD_ITEM, payload: { title: 'First Task' } };
            const result = todoReducer(state, action);
            
            expect(result).toHaveLength(1);
            expect(result[0].order).toBe(0);
        });
    });

    describe('REMOVE_ITEM', () => {
        it('should normalize orders after removal', () => {
            const state = [
                { id: '1', title: 'Task 1', completed: false, order: 0 },
                { id: '2', title: 'Task 2', completed: false, order: 1 },
                { id: '3', title: 'Task 3', completed: false, order: 2 }
            ];
            
            const action = { type: REMOVE_ITEM, payload: { id: '2' } };
            const result = todoReducer(state, action);
            
            expect(result).toHaveLength(2);
            expect(result[0].order).toBe(0);
            expect(result[1].order).toBe(1);
        });
    });

    describe('REMOVE_COMPLETED_ITEMS', () => {
        it('should normalize orders after removing completed items', () => {
            const state = [
                { id: '1', title: 'Task 1', completed: false, order: 0 },
                { id: '2', title: 'Task 2', completed: true, order: 1 },
                { id: '3', title: 'Task 3', completed: false, order: 2 }
            ];
            
            const action = { type: REMOVE_COMPLETED_ITEMS };
            const result = todoReducer(state, action);
            
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('1');
            expect(result[1].id).toBe('3');
            expect(result[0].order).toBe(0);
            expect(result[1].order).toBe(1);
        });
    });

    describe('REORDER_TODOS', () => {
        it('should reorder in All view', () => {
            const state = [
                { id: '1', title: 'Task 1', completed: false, order: 0 },
                { id: '2', title: 'Task 2', completed: false, order: 1 },
                { id: '3', title: 'Task 3', completed: false, order: 2 }
            ];
            
            const action = {
                type: REORDER_TODOS,
                payload: { activeId: '1', overId: '3', filter: '/' }
            };
            const result = todoReducer(state, action);
            
            expect(result[0].id).toBe('2');
            expect(result[1].id).toBe('3');
            expect(result[2].id).toBe('1');
        });

        it('should reorder only active items in Active view', () => {
            const state = [
                { id: '1', title: 'Active 1', completed: false, order: 0 },
                { id: '2', title: 'Completed 1', completed: true, order: 1 },
                { id: '3', title: 'Active 2', completed: false, order: 2 },
                { id: '4', title: 'Active 3', completed: false, order: 3 }
            ];
            
            const action = {
                type: REORDER_TODOS,
                payload: { activeId: '1', overId: '4', filter: '/active' }
            };
            const result = todoReducer(state, action);
            
            const active1 = result.find(t => t.id === '1');
            const active2 = result.find(t => t.id === '3');
            const active3 = result.find(t => t.id === '4');
            const completed1 = result.find(t => t.id === '2');
            
            expect(active2.order).toBeLessThan(active3.order);
            expect(active3.order).toBeLessThan(active1.order);
            expect(completed1).toBeDefined();
        });
    });
});

describe('migrateTodos', () => {
    it('should add order field to todos without it', () => {
        const oldTodos = [
            { id: '1', title: 'Task 1', completed: false },
            { id: '2', title: 'Task 2', completed: true },
            { id: '3', title: 'Task 3', completed: false }
        ];
        
        const result = migrateTodos(oldTodos);
        
        expect(result).toHaveLength(3);
        expect(result[0].order).toBe(0);
        expect(result[1].order).toBe(1);
        expect(result[2].order).toBe(2);
    });

    it('should preserve existing order field', () => {
        const todosWithOrder = [
            { id: '1', title: 'Task 1', completed: false, order: 5 },
            { id: '2', title: 'Task 2', completed: true, order: 3 },
            { id: '3', title: 'Task 3', completed: false, order: 1 }
        ];
        
        const result = migrateTodos(todosWithOrder);
        
        expect(result[0].order).toBe(5);
        expect(result[1].order).toBe(3);
        expect(result[2].order).toBe(1);
    });

    it('should handle empty array', () => {
        const result = migrateTodos([]);
        expect(result).toEqual([]);
    });

    it('should handle null/undefined', () => {
        expect(migrateTodos(null)).toEqual([]);
        expect(migrateTodos(undefined)).toEqual([]);
    });
});
