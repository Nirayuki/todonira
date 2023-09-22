'use client'
import React, { useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

import { MdOutlineDataObject } from 'react-icons/md';

import '../styles/pagination.css';

interface Props<T> {
    children?: React.ReactNode,
    data: T[],
    render: (item: T, index: number) => React.ReactNode,
    perPage: number,
}

export function Pagination<T>({ children, data, render, perPage }: Props<T>) {

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / perPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderItems = () => {
        const startIndex = (currentPage - 1) * perPage;
        const endIndex = startIndex + perPage;
        return data.slice(startIndex, endIndex).map((item, index) => (
            <div key={index}>{render(item, index)}</div>
        ));
    };

    return (
        <>
            <div className="items">
                {data.length === 0 ? (
                    <div className="no-data"><MdOutlineDataObject /> Sem todos</div>
                ) : (
                    renderItems()
                )}
            </div>
            {data.length >= 8 ? (
                <div className="pagination">
                    <div className="item-pag" style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                        onClick={() => prevPage()}
                    >
                        <BiChevronLeft />
                    </div>
                    <div className="item-pag" style={{ cursor: currentPage >= totalPages ? "not-allowed" : "pointer" }}
                        onClick={() => nextPage()}
                    >
                        <BiChevronRight />
                    </div>
                </div>
            ) : null}
        </>
    )
}