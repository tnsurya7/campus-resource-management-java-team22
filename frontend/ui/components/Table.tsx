import React from 'react';

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
    columns: Column[];
    data: any[];
    emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({ columns, data, emptyMessage = 'No data available' }) => {
    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="text-left py-4 px-4 text-sm font-semibold text-gray-900"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                        >
                            {columns.map((column) => (
                                <td key={column.key} className="py-4 px-4 text-sm text-gray-700">
                                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
