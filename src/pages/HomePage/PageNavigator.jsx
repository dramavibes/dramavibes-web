import { Pagination } from "@heroui/react";
import { useState } from "react";

export default function PageNavigator({total, itemsPerPage, page, setPage, showLabels=false, className}) {
    // const [page, setPage] = useState(1);

    const totalItems = total;
    const totalPages = Math.trunc((totalItems-0.1)/itemsPerPage)+1;         // -0.1 is a workaround for when totalItems is exactly divisible e.g. 20/20 should result in 1 pages not 20/20 + 1 = 2
    console.log("PageNavigator", totalItems, totalPages, itemsPerPage)

    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (page > 3) {
                pages.push("ellipsis");
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (page < totalPages - 2) {
                pages.push("ellipsis");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const startItem = (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalItems);

    return (
        <Pagination className={` ${className}`}>
            <Pagination.Summary>
                Showing {startItem}-{endItem} of {totalItems} results
            </Pagination.Summary>
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.Previous isDisabled={page === 1} onPress={() => setPage(page - 1)}>
                        <Pagination.PreviousIcon />
                        {showLabels && <span>Previous</span>}
                    </Pagination.Previous>
                </Pagination.Item>
                {getPageNumbers().map((p, i) =>
                    p === "ellipsis" ? (
                        <Pagination.Item key={`ellipsis-${i}`}>
                            <Pagination.Ellipsis />
                        </Pagination.Item>
                    ) : (
                        <Pagination.Item key={p}>
                            <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                                {p}
                            </Pagination.Link>
                        </Pagination.Item>
                    ),
                )}
                <Pagination.Item>
                    <Pagination.Next isDisabled={page === totalPages} onPress={() => setPage(page + 1)}>
                        {showLabels && <span>Next</span>}
                        <Pagination.NextIcon />
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination>
    );
}