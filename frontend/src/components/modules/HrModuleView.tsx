import React, { useState } from 'react';
import {
  Calendar,
  Search,
  XCircle,
  DollarSign,
  Check,
  Send,
  FileText
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  dept: string;
  role: string;
  ctc: string;
  attendance: string;
  leaveBalance: number;
  punchIn: string;
  status: 'Present' | 'On Leave' | 'Late';
}

interface LeaveTicket {
  id: string;
  staffName: string;
  role: string;
  days: number;
  dates: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'emp-01',
    name: 'Sunil Verma',
    dept: 'Operations & Mill',
    role: 'Senior Dyeing Master',
    ctc: '₹ 32,000',
    attendance: '96.2%',
    leaveBalance: 4,
    punchIn: '09:05 AM',
    status: 'Present'
  },
  {
    id: 'emp-02',
    name: 'Pooja Sharma',
    dept: 'Finance & Accounts',
    role: 'Senior Accountant',
    ctc: '₹ 38,000',
    attendance: '98.5%',
    leaveBalance: 6,
    punchIn: '09:18 AM',
    status: 'Present'
  },
  {
    id: 'emp-03',
    name: 'Amitabh Patel',
    dept: 'Retail & Sales',
    role: 'Commercial Lead',
    ctc: '₹ 45,000',
    attendance: '94.0%',
    leaveBalance: 2,
    punchIn: '09:42 AM',
    status: 'Late'
  },
  {
    id: 'emp-04',
    name: 'Rakesh Kumar',
    dept: 'Logistics',
    role: 'Godown Supervisor',
    ctc: '₹ 26,000',
    attendance: '100%',
    leaveBalance: 8,
    punchIn: '08:50 AM',
    status: 'Present'
  },
  {
    id: 'emp-05',
    name: 'Divya Iyer',
    dept: 'Design & Weaving',
    role: 'Textile Pattern Designer',
    ctc: '₹ 35,000',
    attendance: '91.0%',
    leaveBalance: 1,
    punchIn: '—',
    status: 'On Leave'
  }
];

const INITIAL_LEAVE_TICKETS: LeaveTicket[] = [
  {
    id: 'leave-1',
    staffName: 'Sunil Verma',
    role: 'Senior Dyeing Master',
    days: 2,
    dates: '18 - 19 Oct 2026',
    reason: 'Family ceremony in native village',
    status: 'Pending'
  },
  {
    id: 'leave-2',
    staffName: 'Pooja Sharma',
    role: 'Senior Accountant',
    days: 1,
    dates: '24 Oct 2026',
    reason: 'Bank loan document registration',
    status: 'Pending'
  }
];

interface HrModuleViewProps {
  onNotify?: (msg: string) => void;
  onOpenActionModal?: (type: 'leave') => void;
}

export const HrModuleView: React.FC<HrModuleViewProps> = ({
  onNotify = () => {},
  onOpenActionModal = () => {}
}) => {
  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [leaveTickets, setLeaveTickets] = useState<LeaveTicket[]>(INITIAL_LEAVE_TICKETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [payrollRunning, setPayrollRunning] = useState(false);

  const handleLeaveDecision = (ticketId: string, decision: 'Approved' | 'Rejected') => {
    setLeaveTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: decision } : t))
    );
    onNotify(`Leave ticket marked as ${decision}.`);
  };

  const handleRunPayroll = () => {
    setPayrollRunning(true);
    setTimeout(() => {
      setPayrollRunning(false);
      onNotify('October 2026 Payroll disbursed to 28 staff members via NEFT/UPI.');
    }, 700);
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || member.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#102B4E]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] leading-tight">
            Workforce & Payroll Management
          </h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">
            Attendance tracking, daily rosters, and 1-click Indian statutory payroll with PF, ESI & PT deductions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRunPayroll}
            disabled={payrollRunning}
            className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>{payrollRunning ? 'Calculating Payroll…' : 'Run October Payroll'}</span>
          </button>
          <button
            onClick={() => onOpenActionModal('leave')}
            className="px-4 py-2 rounded-full bg-white/80 hover:bg-white text-[#102B4E] text-xs font-bold border border-white/90 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>Review Leave Ticket</span>
          </button>
        </div>
      </div>

      {/* 4 Canonical KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Total Workforce</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">28 Staff</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">24 Full-Time • 4 Daily-Wage</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Monthly Net Pay</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7EEDA] text-[#C69A43] border border-[#C69A43]/40">
              1st of Month
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">₹ 8.42L</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">Includes statutory deductions</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Attendance Today</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              96.4%
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">27 In Office</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">1 On Approved Personal Leave</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Pending Leaves</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-[#C69A43] border border-amber-200">
              Review
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">2 Requests</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">Awaiting Manager sign-off</div>
          </div>
        </div>
      </div>

      {/* Indian Statutory Deductions Engine & Leave Queue (Two-Column Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Card 1: Statutory Indian Payroll Breakdown */}
        <div className="gn-panel p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#102B4E]" />
              <h3 className="text-sm sm:text-base font-bold text-[#102B4E] tracking-tight">
                Indian Labor & Statutory Deductions Architecture
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Form 16 Ready
            </span>
          </div>

          <p className="text-xs text-[#55677D] mb-3">
            Auto-calculated statutory contributions across 28 staff members for October 2026:
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-xl bg-white/70">
              <span className="text-[#55677D]">Gross Base Wages (Basic + DA 50%):</span>
              <span className="font-bold text-[#102B4E]">₹ 4,21,000</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-white/70">
              <span className="text-[#55677D]">Employee Provident Fund (PF 12%):</span>
              <span className="font-bold text-rose-700">- ₹ 50,520</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-white/70">
              <span className="text-[#55677D]">Employees' State Insurance (ESI 0.75%):</span>
              <span className="font-bold text-rose-700">- ₹ 6,315</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-white/70">
              <span className="text-[#55677D]">State Professional Tax (PT ₹200/employee):</span>
              <span className="font-bold text-rose-700">- ₹ 5,600</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-[#F7EEDA] border border-[#C69A43]/40">
              <span className="font-bold text-[#102B4E]">Total Net Disbursable Salary Bank Payout:</span>
              <span className="font-bold text-[#102B4E] text-sm">₹ 6,95,365</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#102B4E]/10 flex items-center justify-between text-[11px] text-[#55677D]">
            <span>Bank Partner: HDFC Corporate Salary A/c</span>
            <button
              onClick={() => onNotify('WhatsApp salary slip dispatch queue initiated.')}
              className="text-[#C69A43] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Dispatch Salary Slips via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Card 2: Leave Approval Queue */}
        <div className="gn-panel p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10 mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C69A43]" />
              <h3 className="text-sm sm:text-base font-bold text-[#102B4E] tracking-tight">
                Pending Staff Leave Applications
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-[#C69A43] border border-amber-200">
              Approval Queue
            </span>
          </div>

          <div className="space-y-2.5">
            {leaveTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-3 rounded-2xl bg-white/80 border border-[#102B4E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#102B4E]">{ticket.staffName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#102B4E]/5 text-[#55677D]">
                      {ticket.role}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-[#55677D] mt-0.5">
                    <strong>{ticket.days} Days</strong> ({ticket.dates}) — {ticket.reason}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {ticket.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleLeaveDecision(ticket.id, 'Rejected')}
                        className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 cursor-pointer"
                        title="Reject Leave"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleLeaveDecision(ticket.id, 'Approved')}
                        className="px-3 py-1 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-[#C69A43]" />
                        <span>Approve</span>
                      </button>
                    </>
                  ) : (
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      ticket.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {ticket.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-[#102B4E]/10 text-right">
            <span className="text-[11px] text-[#55677D]">
              Approvals are logged directly to the immutable audit stream.
            </span>
          </div>
        </div>

      </div>

      {/* Staff Roster Table */}
      <div className="gn-panel p-5">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#102B4E]/10 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Operations & Mill', 'Finance & Accounts', 'Retail & Sales', 'Logistics'].map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  deptFilter === dept
                    ? 'bg-[#F7EEDA] text-[#102B4E] border border-[#C69A43]/40 font-bold shadow-2xs'
                    : 'text-[#55677D] hover:text-[#102B4E] hover:bg-white/70'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#55677D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff member..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E] focus:outline-none focus:ring-1 focus:ring-[#C69A43]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#102B4E]/10 text-[#55677D] font-bold uppercase tracking-wider text-[10.5px]">
                <th className="py-2.5 px-3">Staff Member</th>
                <th className="py-2.5 px-3">Department & Role</th>
                <th className="py-2.5 px-3 text-right">Monthly CTC</th>
                <th className="py-2.5 px-3 text-center">Punch-In (Today)</th>
                <th className="py-2.5 px-3 text-right">Attendance %</th>
                <th className="py-2.5 px-3 text-right">Leave Bal.</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#102B4E]/5">
              {filteredStaff.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#102B4E]">{emp.name}</div>
                    <div className="text-[10px] text-[#55677D]">ID: {emp.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#102B4E]">{emp.role}</div>
                    <div className="text-[11px] text-[#55677D]">{emp.dept}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#102B4E]">
                    {emp.ctc}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-[11px] text-[#55677D]">
                    {emp.punchIn}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-xs text-emerald-700">
                    {emp.attendance}
                  </td>
                  <td className="py-3 px-3 text-right text-[11.5px] text-[#55677D]">
                    {emp.leaveBalance} Days
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                      emp.status === 'Present'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : emp.status === 'Late'
                        ? 'bg-amber-50 text-[#C69A43] border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
