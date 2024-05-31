import { Loan, Payment, User } from "@/utils/props";
import { formatCurrency } from "../utils/functions";

interface PaymentCardProps {
  payment: Payment;
}

export default function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <div className="p-5 rounded-3xl bg-white shadow-lg flex gap-6">
      <p className="text-2xl">Payment Date: {payment.paymentDate}</p>
      <p className="text-2xl">
        Amount:{" "}
        <span className="font-bold">{formatCurrency(payment.balance)}</span>
      </p>
    </div>
  );
}
