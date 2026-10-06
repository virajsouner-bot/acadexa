"use client";

import { useEffect, useState } from "react";

type Fee = {
  id: number;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: string;
};

type Summary = {
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  totalRecords: number;
};

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);

  const [summary, setSummary] = useState<Summary>({
    totalAmount: 0,
    totalPaid: 0,
    totalPending: 0,
    totalRecords: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFees();
  }, []);

  async function loadFees() {
    try {
      const response = await fetch(
        "/api/student/fees"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load fees."
        );
      }

      setFees(data.fees || []);

      setSummary(
        data.summary || {
          totalAmount: 0,
          totalPaid: 0,
          totalPending: 0,
          totalRecords: 0,
        }
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load fees."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatAmount(amount: number) {
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  function getStatusClass(status: string) {
    const value = status.toLowerCase();

    if (value === "paid") {
      return "bg-green-100 text-green-700";
    }

    if (value === "partial") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">
            💰
          </div>

          <p className="text-gray-500">
            Loading fee details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] p-6 md:p-8">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-semibold text-green-600">
          Student Finance
        </p>

        <h1 className="text-3xl font-bold text-[#17221c] mt-1">
          My Fees
        </h1>

        <p className="text-gray-500 mt-2">
          View your fee payments and outstanding balance.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="bg-white border border-red-100 rounded-2xl p-6 mb-6">
          <p className="text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Fees
          </p>

          <p className="text-3xl font-bold text-[#17221c] mt-2">
            {formatAmount(summary.totalAmount)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">
            Amount Paid
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {formatAmount(summary.totalPaid)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending Amount
          </p>

          <p className="text-3xl font-bold text-red-500 mt-2">
            {formatAmount(summary.totalPending)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">
            Fee Records
          </p>

          <p className="text-3xl font-bold text-[#17221c] mt-2">
            {summary.totalRecords}
          </p>
        </div>

      </div>

      {/* Payment Progress */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        <div className="flex justify-between items-center mb-3">

          <div>
            <h2 className="font-bold text-[#17221c]">
              Payment Progress
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Amount paid against total fees
            </p>
          </div>

          <span className="font-bold text-green-600">
            {summary.totalAmount > 0
              ? Math.round(
                  (summary.totalPaid /
                    summary.totalAmount) *
                    100
                )
              : 0}
            %
          </span>

        </div>

        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">

          <div
            className="h-full bg-[#16a34a] rounded-full"
            style={{
              width: `${
                summary.totalAmount > 0
                  ? Math.min(
                      (summary.totalPaid /
                        summary.totalAmount) *
                        100,
                      100
                    )
                  : 0
              }%`,
            }}
          />

        </div>

      </div>

      {/* Fee Records */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-6 border-b border-gray-100">

          <h2 className="text-xl font-bold text-[#17221c]">
            Fee Details
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Your complete fee payment history
          </p>

        </div>

        {fees.length === 0 ? (
          <div className="p-12 text-center">

            <div className="text-5xl mb-4">
              💰
            </div>

            <h3 className="font-bold text-gray-800">
              No fee records
            </h3>

            <p className="text-gray-500 mt-2">
              Your fee details will appear here once
              they are added.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Fee ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Due Date
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Total
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Paid
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Pending
                  </th>

                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {fees.map((fee) => {

                  const pending =
                    fee.amount - fee.paidAmount;

                  return (
                    <tr
                      key={fee.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-5">
                        <span className="font-semibold text-gray-800">
                          #{fee.id}
                        </span>
                      </td>

                      <td className="px-6 py-5">

                        <span className="text-gray-700">
                          {new Date(
                            fee.dueDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-right font-semibold">
                        {formatAmount(fee.amount)}
                      </td>

                      <td className="px-6 py-5 text-right font-semibold text-green-600">
                        {formatAmount(fee.paidAmount)}
                      </td>

                      <td className="px-6 py-5 text-right font-semibold text-red-500">
                        {formatAmount(pending)}
                      </td>

                      <td className="px-6 py-5 text-center">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(
                            fee.status
                          )}`}
                        >
                          {fee.status}
                        </span>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}