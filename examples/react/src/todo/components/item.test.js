import React from 'react';
import { render, screen } from '@testing-library/react';
import { Item } from './item';
import { DndContext } from '@dnd-kit/core';

describe('Item Component', () => {
    const mockDispatch = jest.fn();
    const mockTodo = {
        id: 'test-1',
        title: 'Test Todo',
        completed: false,
        order: 0
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render drag handle', () => {
        render(
            <DndContext>
                <Item todo={mockTodo} dispatch={mockDispatch} index={0} />
            </DndContext>
        );

        const dragHandle = screen.getByLabelText(/Drag to reorder/i);
        expect(dragHandle).toBeInTheDocument();
        expect(dragHandle).not.toBeDisabled();
    });

    it('should disable drag handle when in edit mode', () => {
        render(
            <DndContext>
                <Item todo={mockTodo} dispatch={mockDispatch} index={0} />
            </DndContext>
        );

        const label = screen.getByTestId('todo-item-label');
        label.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

        const dragHandle = screen.getByLabelText(/Drag to reorder/i);
        expect(dragHandle).toBeDisabled();
    });

    it('should have proper ARIA attributes on drag handle', () => {
        render(
            <DndContext>
                <Item todo={mockTodo} dispatch={mockDispatch} index={0} />
            </DndContext>
        );

        const dragHandle = screen.getByLabelText(/Drag to reorder Test Todo/i);
        expect(dragHandle).toHaveAttribute('aria-label');
        expect(dragHandle).toHaveAttribute('aria-disabled', 'false');
    });
});
