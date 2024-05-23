import { Loan, Payment, User } from "@/utils/props";

interface PaymentCardProps {
  payment: Payment;
}

export default function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <div className="p-5 rounded-3xl bg-white shadow-lg flex gap-6">
      <p>Chungus</p>
    </div>
  );
}
