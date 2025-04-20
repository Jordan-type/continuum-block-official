"use client";

import React, { useState, useMemo } from "react";
import Loading from "@/components/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useGetTransactionsQuery, useListCoursesByIdsQuery } from "@/state/api";
import { useUser } from "@clerk/nextjs";


const UserBilling = () => {
  const [paymentType, setPaymentType] = useState("all");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isLoaded } = useUser();
  const { data: transactions, isLoading: isLoadingTransactions, isError: isErrorTransactions } = useGetTransactionsQuery(user?.id || "", {
      skip: !isLoaded || !user,
    });

// Get unique courseIds from transactions
const courseIds = useMemo(() => {
  return [...new Set(transactions?.map((t) => t.courseId.toString()) || [])];
}, [transactions]);

// Fetch courses by IDs in a single batch
const { data: courses, isLoading: isLoadingCourses, isError: isErrorCourses } =
useListCoursesByIdsQuery(courseIds, {
  skip: !courseIds.length || isLoadingTransactions,
});

// Create courseNameMap from batch query
const courseNameMap = useMemo(() => {
  const map: { [key: string]: string } = {};
  courses?.forEach((course) => {
    map[course._id.toString()] = course.title;
  });
  return map;
}, [courses]);

const courseImageMap = useMemo(() => {
  const map: { [key: string]: string } = {};
  courses?.forEach((course) => {
    map[course._id.toString()] = course.image || "/placeholder.png"; // Fallback image if course.image is not available
  });
  return map;
}, [courses]);

  const filteredData =
    transactions?.filter((transaction) => {
      const matchesTypes =
        paymentType === "all" || transaction.paymentProvider === paymentType;
      return matchesTypes;
    }) || [];


    // Pagination logic
  const entriesPerPageNum = parseInt(entriesPerPage); // Convert to number
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPageNum);
  const startIndex = (currentPage - 1) * entriesPerPageNum;
  const endIndex = startIndex + entriesPerPageNum;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please sign in to view your billing information.</div>;

  return (
    <div className="billing">
      <div className="billing__container">
        <h2 className="billing__title">Payment History</h2>
        <div className="billing__filters flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className="billing__select bg-gray-800 border-gray-700 text-white w-32">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent className="billing__select-content bg-gray-800 text-white border-gray-700">
                <SelectItem className="billing__select-item" value="10">
                  Show 10
                </SelectItem>
                <SelectItem className="billing__select-item" value="25">
                  Show 25
                </SelectItem>
                <SelectItem className="billing__select-item" value="50">
                  Show 50
                </SelectItem>
              </SelectContent>
            </Select>
          <Select value={paymentType} onValueChange={setPaymentType}>
            <SelectTrigger className="billing__select">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>

            <SelectContent className="billing__select-content">
              <SelectItem className="billing__select-item" value="all">
                All Types
              </SelectItem>
              <SelectItem className="billing__select-item" value="free">
                Free
              </SelectItem>
              <SelectItem className="billing__select-item" value="M-Pesa">
                M-Pesa
              </SelectItem>
              <SelectItem className="billing__select-item" value="stripe">
                Stripe
              </SelectItem>
              <SelectItem className="billing__select-item" value="paypal">
                Paypal
              </SelectItem>
            </SelectContent>
          </Select>
          </div>
        </div>

        <div className="billing__grid">
          {isLoadingTransactions || isLoadingCourses ? (
            <Loading />
          ) : isErrorTransactions || isErrorCourses ? (
            <div>Error loading course title</div>
          ) : (
            <Table className="billing__table">
              <TableHeader className="billing__table-header">
                <TableRow className="billing__table-header-row">
                  <TableHead className="billing__table-cell w-12"><Checkbox /></TableHead>
                  <TableHead className="billing__table-cell">Course</TableHead>
                  <TableHead className="billing__table-cell">Amount</TableHead>
                  <TableHead className="billing__table-cell">Payment Method</TableHead>
                  <TableHead className="billing__table-cell">Date</TableHead>
                  <TableHead className="billing__table-cell">Status</TableHead>
                  <TableHead className="billing__table-cell w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="billing__table-body">
                {paginatedData.length > 0 ? (
                  paginatedData.map((transaction) => (
                    <TableRow className="billing__table-row" key={transaction._id}>
                      <TableCell className="billing__table-cell">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="billing__table-cell flex items-center space-x-3">
                        <Image
                          src={courseImageMap[transaction.courseId.toString()] || "/placeholder.png"}
                          alt={courseNameMap[transaction.courseId.toString()] || "Unknown Course"}
                          width={80}
                          height={80}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-medium">
                            {courseNameMap[transaction.courseId.toString()] || "Unknown Course"}
                          </p>
                          <p className="text-gray-400 text-sm">#{transaction._id.slice(-10)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="billing__table-cell billing__amount">
                        {formatPrice(transaction.amount)}
                      </TableCell>
                      <TableCell className="billing__table-cell">
                        {transaction.paymentProvider}
                      </TableCell>
                      <TableCell className="billing__table-cell">
                        {new Date(transaction.dateTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="billing__table-cell">
                      <span
                          className={`px-2 py-1 rounded text-xs ${
                            transaction.status === "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell className="billing__table-cell flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="billing__table-row">
                    <TableCell
                      className="billing__table-cell text-center"
                      colSpan={5}
                    >
                      No transactions to display
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {/* Dynamic page numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (
                  (page === currentPage - 2 && page > 1) ||
                  (page === currentPage + 2 && page < totalPages)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default UserBilling;
