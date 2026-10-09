"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  BrainCircuit,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Code2,
  Copy,
  CreditCard,
  Database,
  Download,
  FileBarChart,
  FileCheck2,
  FileText,
  Filter,
  FolderLock,
  GraduationCap,
  HandCoins,
  HeartPulse,
  HelpCircle,
  Home,
  KeyRound,
  Landmark,
  Laptop,
  Link2,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Network,
  PiggyBank,
  Plus,
  QrCode,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  SmartphoneNfc,
  Sparkles,
  Store,
  TrendingUp,
  UploadCloud,
  UserPlus,
  Users,
  WalletCards,
  Webhook,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Role =
  | "Merchant"
  | "Lender"
  | "Hospital"
  | "School"
  | "Susu Group"
  | "Prospeva Agent"
  | "Church"
  | "Landlord";
type AuthView = "signin" | "signup" | "mfa" | "portal";

const roles: Role[] = [
  "Merchant",
  "Lender",
  "Hospital",
  "School",
  "Susu Group",
  "Prospeva Agent",
  "Church",
  "Landlord",
];

const roleData: Record<Role, any> = {
  Merchant: {
    name: "Stop & Shop",
    id: "MRC-LBR-2081",
    icon: Store,
    balance: "1,250.00 USD",
    secondary: "84,500 LRD",
    metric: "325.00 USD",
    metricLabel: "Received today",
    pending: "3 settlements",
    people: "1,284 customers",
    peopleLabel: "Customers",
    headline: "Run sales, settlements and customer payments from one place.",
    records: [
      ["Kelvin F.", "Card sale · Main store", "+50.00 USD", "Settled"],
      ["Martha K.", "PayLink · Rice order", "+100.00 USD", "Settled"],
      ["James Doe", "Pay from Salary", "+85.00 USD", "Pending"],
    ],
  },
  Lender: {
    name: "Unity Bank",
    id: "LDR-LBR-0098",
    icon: Landmark,
    balance: "425,000 USD",
    secondary: "18.2M LRD",
    metric: "34",
    metricLabel: "New employee requests",
    pending: "12 offers awaiting",
    people: "842 borrowers",
    peopleLabel: "Borrowers",
    headline: "Review financial identity, issue offers and collect by payroll.",
    records: [
      ["Martha K.", "Payroll repayment", "+112.00 USD", "Collected"],
      ["Samuel T.", "Pre-approved offer", "400.00 USD", "Review"],
      ["Stop & Shop", "Merchant settlement", "12,450 USD", "Scheduled"],
    ],
  },
  Hospital: {
    name: "Monrovia Medical Center",
    id: "HSP-LBR-3007",
    icon: HeartPulse,
    balance: "284,500 USD",
    secondary: "8.4M LRD",
    metric: "136",
    metricLabel: "Patient payments today",
    pending: "18 open invoices",
    people: "4,620 patients",
    peopleLabel: "Patients & sponsors",
    headline: "Manage patient, sponsor and insurer payments securely.",
    records: [
      ["Kelvin F.", "Outpatient services", "+85.00 USD", "Settled"],
      ["Martha K.", "Pharmacy invoice", "+4,200 LRD", "Settled"],
      ["Atlantic Insurance", "Claim MMC-2819", "1,450 USD", "Pending"],
    ],
  },
  School: {
    name: "Divine Academy",
    id: "SCH-LBR-2031",
    icon: GraduationCap,
    balance: "1,840,000 LRD",
    secondary: "12,500 USD",
    metric: "78%",
    metricLabel: "Tuition collected this term",
    pending: "42 balances due",
    people: "486 students",
    peopleLabel: "Students & guardians",
    headline: "Collect tuition, manage families and reconcile every campus.",
    records: [
      ["Martha K.", "Grade 8 tuition", "+32,000 LRD", "Settled"],
      ["Hawa S.", "Registration fee", "+150.00 USD", "Settled"],
      ["Samuel T.", "September balance", "18,500 LRD", "Due"],
    ],
  },
  "Susu Group": {
    name: "Forward Together Susu",
    id: "SSU-LBR-2048",
    icon: PiggyBank,
    balance: "286,000 LRD",
    secondary: "1,350 USD",
    metric: "92%",
    metricLabel: "Contributions this cycle",
    pending: "2 members due",
    people: "12 members",
    peopleLabel: "Members",
    headline: "Keep contributions, approvals and rotating payouts transparent.",
    records: [
      ["Martha K.", "Weekly contribution", "+12,000 LRD", "Received"],
      ["James Doe", "Weekly contribution", "+12,000 LRD", "Received"],
      ["Hawa S.", "Cycle contribution", "12,000 LRD", "Due"],
    ],
  },
  "Prospeva Agent": {
    name: "Prospeva Agent – Sinkor",
    id: "AGT-SIN-4821",
    icon: Users,
    balance: "485,000 LRD",
    secondary: "6,250 USD float",
    metric: "84",
    metricLabel: "Transactions today",
    pending: "5 cash reservations",
    people: "2,910 customers",
    peopleLabel: "Customers",
    headline: "Manage cash, digital float, customer codes and commissions.",
    records: [
      ["Kelvin F.", "Cash deposit", "+1,000 LRD", "Confirmed"],
      ["Martha K.", "Cash withdrawal", "−150.00 USD", "Completed"],
      ["Agent commission", "Daily earnings", "+4,850 LRD", "Available"],
    ],
  },
  Church: {
    name: "Grace Community Church",
    id: "CHR-LBR-1048",
    icon: Sparkles,
    balance: "38,450 USD",
    secondary: "2.6M LRD",
    metric: "425",
    metricLabel: "Contributions this month",
    pending: "3 pledges due",
    people: "1,820 members",
    peopleLabel: "Members & donors",
    headline: "Manage offerings, pledges, appeals and ministry funds.",
    records: [
      ["Anonymous donor", "Community outreach", "+250.00 USD", "Received"],
      ["Martha K.", "Sunday offering", "+5,000 LRD", "Received"],
      ["Youth Ministry", "Fund allocation", "25,000 LRD", "Approved"],
    ],
  },
  Landlord: {
    name: "Fallah Properties",
    id: "LND-LBR-1042",
    icon: Home,
    balance: "284,000 LRD",
    secondary: "2,450 USD",
    metric: "72%",
    metricLabel: "Rent collected this month",
    pending: "4 rents overdue",
    people: "28 tenants",
    peopleLabel: "Tenants",
    headline: "Collect rent, manage properties and track tenant balances.",
    records: [
      ["Martha K.", "September rent · Unit 2A", "+24,000 LRD", "Settled"],
      ["Samuel T.", "Congo Town · House 4", "650.00 USD", "Due"],
      ["Hawa S.", "Security deposit", "+18,500 LRD", "Held"],
    ],
  },
};

const navigation = [
  ["Overview", Home],
  ["Financial operations", WalletCards],
  ["Payments & billing", HandCoins],
  ["Cash In", Plus],
  ["Withdrawals", Banknote],
  ["Commissions", CircleDollarSign],
  ["PayLink & QR", QrCode],
  ["Approvals", ShieldCheck],
  ["People & accounts", Users],
  ["Merchant financing", Landmark],
  ["Eligibility & consent", ClipboardCheck],
  ["Organization control", Settings2],
  ["Reconciliation", RefreshCw],
  ["Reports", FileBarChart],
  ["Documents", FolderLock],
  ["Connections", Network],
  ["Connectivity & Sync", RefreshCw],
  ["Developer & API", Code2],
  ["Support", HelpCircle],
] as const;

const roleNavigation: Record<Role, string[]> = {
  Merchant: [
    "Overview",
    "Financial operations",
    "Payments & billing",
    "PayLink & QR",
    "Approvals",
    "People & accounts",
    "Merchant financing",
    "Organization control",
    "Reconciliation",
    "Reports",
    "Documents",
    "Connections",
    "Connectivity & Sync",
    "Developer & API",
    "Support",
  ],
  Lender: [
    "Overview",
    "Financial operations",
    "Payments & billing",
    "Approvals",
    "People & accounts",
    "Merchant financing",
    "Eligibility & consent",
    "Organization control",
    "Reconciliation",
    "Reports",
    "Documents",
    "Connections",
    "Connectivity & Sync",
    "Developer & API",
    "Support",
  ],
  Hospital: [
    "Overview",
    "Financial operations",
    "Payments & billing",
    "PayLink & QR",
    "Approvals",
    "People & accounts",
    "Organization control",
    "Reconciliation",
    "Reports",
    "Documents",
    "Connections",
    "Connectivity & Sync",
    "Support",
  ],
  School: [
    "Overview",
    "Financial operations",
    "Payments & billing",
    "PayLink & QR",
    "Approvals",
    "People & accounts",
    "Organization control",
    "Reconciliation",
    "Reports",
    "Documents",
    "Connections",
    "Connectivity & Sync",
    "Support",
  ],
  "Susu Group": [
    "Overview",
    "Financial operations",
    "Payments & billing",
    "PayLink & QR",
    "Approvals",
    "People & accounts",
    "Organization control",
    "Reconciliation",
    "Reports",
    "Documents",
    "Connectivity & Sync",
    "Support",
  ],
  "Prospeva Agent": [
    "Overview",
    "Cash In",
    "Withdrawals",
    "Reconciliation",
    "Commissions",
    "Support",
  ],
  Church: [
    "Overview",
    "Financial operations",
    "Payments & billing",
    "PayLink & QR",
    "Approvals",
    "People & accounts",
    "Organization control",
    "Reconciliation",
    "Reports",
    "Documents",
    "Connectivity & Sync",
    "Support",
  ],
  Landlord: [
    "Overview",
    "Financial operations",
    "Payments & billing",
    "PayLink & QR",
    "Approvals",
    "People & accounts",
    "Organization control",
    "Reconciliation",
    "Reports",
    "Documents",
    "Connectivity & Sync",
    "Support",
  ],
};
const navigationFor = (role: Role) =>
  navigation.filter(([label]) => roleNavigation[role].includes(label));

const roleWorkspaces: Record<Role, Array<[string, string, string]>> = {
  Merchant: [
    ["Tap on Phone", "28 sales", "Accept contactless cards"],
    ["Catalog PayLinks", "46 items", "Price and share products"],
    ["Settlements", "3 pending", "Track bank and wallet payouts"],
    ["Customers", "1,284", "View repeat buyers and refunds"],
  ],
  Lender: [
    ["Credit applications", "34 new", "Review verified financial identity"],
    ["Pre-approved offers", "12 ready", "Price and send employee offers"],
    ["Risk monitor", "3 alerts", "Employer and borrower signals"],
    ["Payroll collections", "96.8%", "Track salary-linked repayments"],
  ],
  Hospital: [
    ["Patient invoices", "18 open", "Charges, balances and references"],
    ["Sponsors", "42 active", "Family and institutional sponsors"],
    ["Insurance claims", "9 pending", "Submit and track claims"],
    ["Payment plans", "23 active", "Flexible patient repayment"],
  ],
  School: [
    ["Students & guardians", "486", "Verified family accounts"],
    ["Tuition schedules", "42 due", "Term plans and reminders"],
    ["Campuses", "3 locations", "Collections by campus"],
    ["Scholarships", "18 active", "Sponsor and aid balances"],
  ],
  "Susu Group": [
    ["Contribution cycle", "4 of 12", "Weekly member ledger"],
    ["Payout order", "Martha next", "Transparent rotation"],
    ["Missed payments", "2 due", "Reminders and exceptions"],
    ["Group approvals", "3 pending", "Two-officer controls"],
  ],
  "Prospeva Agent": [
    ["Cash availability", "620,000 LRD", "Reserve customer cash"],
    ["Digital float", "485,000 LRD", "LRD and USD availability"],
    ["Deposit queue", "5 waiting", "Confirm six-digit codes"],
    ["Commissions", "4,850 LRD", "Today’s earned fees"],
  ],
  Church: [
    ["Offerings & tithes", "425 gifts", "Track designated giving"],
    ["Pledges", "3 due", "Campaign commitments"],
    ["Ministries", "8 funds", "Restricted fund controls"],
    ["Donor statements", "Ready", "Receipts and annual history"],
  ],
  Landlord: [
    ["Properties", "4 active", "Units and occupancy"],
    ["Tenants & leases", "28", "Terms, deposits and documents"],
    ["Rent collection", "72%", "Paid, due and overdue"],
    ["Maintenance", "6 open", "Requests and vendor costs"],
  ],
};

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? "light" : ""}`}>
      <img src="/prospeva-logo.png" alt="Prospeva" />
      <small>BUSINESS</small>
    </div>
  );
}

export default function ProspevaBusinessPortal() {
  const [auth, setAuth] = useState<AuthView>("signin");
  const [role, setRole] = useState<Role>("Merchant");
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [signupStep, setSignupStep] = useState(1);
  const [email, setEmail] = useState("kelvin@prospeva.lr");
  const [password, setPassword] = useState("Prospeva2026");
  const [isOnline, setIsOnline] = useState(true);
  const data = roleData[role];
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };
  const navigate = (page: string) => {
    setActive(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    const sync = () => setIsOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (auth !== "portal") {
    return (
      <AuthExperience
        view={auth}
        setView={setAuth}
        role={role}
        setRole={setRole}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        signupStep={signupStep}
        setSignupStep={setSignupStep}
      />
    );
  }

  return (
    <main className="portal-shell">
      <Sidebar
        active={active}
        navigate={navigate}
        data={data}
        role={role}
        setAuth={setAuth}
      />
      <section className="portal-main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu />
          </button>
          <div>
            <small>GOOD MORNING</small>
            <h1>{active}</h1>
          </div>
          <div className="topbar-actions">
            <button
              className="connection-chip prototype"
              onClick={() => navigate("Connectivity & Sync")}
            >
              <i />
              Prototype mode
            </button>
            <Select
              value={role}
              onValueChange={(value) => {
                setRole(value as Role);
                navigate("Overview");
              }}
            >
              <SelectTrigger className="role-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((item) => (
                  <SelectItem key={item} value={item}>
                    {roleData[item].name} · {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              className="icon-button"
              onClick={() => navigate("Notifications")}
              aria-label="Open notifications"
            >
              <Bell />
              <i />
            </button>
            <button
              className="user-chip"
              onClick={() => setAction("Account & security")}
            >
              <span>KF</span>
              <b>Kelvin Fallah</b>
            </button>
          </div>
        </header>
        <div className="prototype-banner" role="status">
          <Database />
          <span><b>Demo environment</b> Shared backend not connected · external payment rails and provider integrations are disabled.</span>
          <em>{data.name} · {role} · {data.id}</em>
        </div>
        <div className="portal-content">
          {active === "Overview" &&
            (role === "Prospeva Agent" ? (
              <AgentWorkspace page="Overview" notify={notify} />
            ) : (
              <Overview
                role={role}
                data={data}
                setAction={setAction}
                navigate={navigate}
                notify={notify}
              />
            ))}
          {role === "Prospeva Agent" &&
            ["Cash In", "Withdrawals", "Commissions"].includes(active) && (
              <AgentWorkspace page={active} notify={notify} />
            )}
          {active === "Connections" && <Connections notify={notify} />}
          {active === "Connectivity & Sync" && (
            <BusinessConnectivity
              isOnline={isOnline}
              role={role}
              notify={notify}
            />
          )}
          {active === "Approvals" && (
            <Approvals data={data} role={role} notify={notify} />
          )}
          {active === "PayLink & QR" && (
            <PayTools
              data={data}
              role={role}
              notify={notify}
              setAction={setAction}
            />
          )}
          {active === "Financial operations" && (
            <FinancialOperations
              data={data}
              notify={notify}
              setAction={setAction}
            />
          )}
          {active === "Payments & billing" && (
            <Billing
              role={role}
              data={data}
              notify={notify}
              setAction={setAction}
            />
          )}
          {active === "Organization control" && (
            <OrganizationControl role={role} data={data} notify={notify} setAction={setAction} />
          )}
          {active === "People & accounts" && (
            <PeopleAccounts role={role} data={data} setAction={setAction} />
          )}
          {active === "Merchant financing" && (
            <MerchantFinancing
              role={role}
              data={data}
              notify={notify}
              setAction={setAction}
            />
          )}
          {active === "Reconciliation" && (
            <Reconciliation data={data} notify={notify} />
          )}
          {active === "Reports" && (
            <ReportsCenter role={role} data={data} notify={notify} setAction={setAction} />
          )}
          {active === "Documents" && <Documents role={role} notify={notify} />}
          {active === "Developer & API" && <DeveloperCenter notify={notify} />}
          {active === "Support" && (
            <SupportCenter data={data} notify={notify} />
          )}
          {active === "Eligibility & consent" && (
            <EligibilityConsent
              role={role}
              notify={notify}
              setAction={setAction}
            />
          )}
          {active === "Notifications" && <NotificationCenter notify={notify} />}
          {active === "ProspevaAI" && (
            <ProspevaAI
              role={role}
              data={data}
              notify={notify}
              setAction={setAction}
            />
          )}
          {active.startsWith("Workspace · ") && (
            <RoleModulePage
              role={role}
              data={data}
              moduleName={active.replace("Workspace · ", "")}
              navigate={navigate}
              notify={notify}
              setAction={setAction}
            />
          )}
          {![
            "Overview",
            "Connections",
            "Connectivity & Sync",
            "Approvals",
            "PayLink & QR",
            "Financial operations",
            "Payments & billing",
            "Eligibility & consent",
            "People & accounts",
            "Merchant financing",
            "Organization control",
            "Reconciliation",
            "Reports",
            "Documents",
            "Developer & API",
            "Support",
            "Notifications",
            "ProspevaAI",
          ].includes(active) && !active.startsWith("Workspace · ") && (
            <WorkspacePage
              title={active}
              role={role}
              data={data}
              notify={notify}
              setAction={setAction}
            />
          )}
        </div>
      </section>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="mobile-sheet">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <SheetDescription>
              {data.name} · {role}
            </SheetDescription>
          </SheetHeader>
          <nav>
            {navigationFor(role).map(([label, Icon]) => (
              <button
                key={label}
                className={active === label ? "active" : ""}
                onClick={() => navigate(label)}
              >
                <Icon />
                {label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Sheet
        open={Boolean(action)}
        onOpenChange={(open) => !open && setAction(null)}
      >
        <SheetContent side="right" className="action-sheet">
          <ActionPanel
            action={action || ""}
            role={role}
            data={data}
            close={() => setAction(null)}
            notify={notify}
            isOnline={isOnline}
          />
        </SheetContent>
      </Sheet>
      <button className="ai-launcher" onClick={() => navigate("ProspevaAI")}>
        <BrainCircuit />
        ProspevaAI
      </button>
      {toast && (
        <div className="toast">
          <Check />
          {toast}
        </div>
      )}
    </main>
  );
}

function Sidebar({ active, navigate, data, role, setAuth }: any) {
  return (
    <aside className="sidebar">
      <Logo light />
      <div className="workspace-badge">
        <data.icon />
        <span>
          <small>ACTIVE WORKSPACE</small>
          <b>{data.name}</b>
          <em>{data.id}</em>
        </span>
        <BadgeCheck />
      </div>
      <nav>
        {navigationFor(role).map(([label, Icon]) => (
          <button
            key={label}
            className={active === label ? "active" : ""}
            onClick={() => navigate(label)}
          >
            <Icon />
            <span>{label}</span>
            {label === "Approvals" && <i>6</i>}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-ai" onClick={() => navigate("ProspevaAI")}>
          <BrainCircuit />
          ProspevaAI
        </button>
        <span>PROSPEVA SECURE</span>
        <small>MFA · Role-based access · Audit logged</small>
        <button onClick={() => setAuth("signin")}>
          <LogOut />
          Sign out
        </button>
      </div>
    </aside>
  );
}

function MerchantFinancing({ role, data, notify, setAction }: any) {
  const merchantEvidence = [
    ["Business size", "Medium enterprise", "Verified KYB profile", Building2],
    ["Sales volume", "USD 125,420", "Trailing 90-day verified sales", BarChart3],
    ["Branch network", "4 branches", "3 active · 1 onboarding", MapPin],
    ["Settlement history", "98.7% completed", "No unresolved material break", RefreshCw],
    ["Customer demand", "+18%", "Four-week order trend", TrendingUp],
    ["Requested product", "Inventory finance", "Restock and branch expansion", Boxes],
    ["Risk control", "Review", "Two conditions require verification", ShieldCheck],
  ] as const;
  const lenderOffers = [
    { lender: "Unity Bank", model: "Revenue-based finance", amount: "USD 25,000", term: "Up to 18 months", collection: "2.8% of eligible settlements", status: "Eligible to apply" },
    { lender: "Monrovia SME Fund", model: "Revolving inventory line", amount: "USD 15,000", term: "90-day renewable cycle", collection: "Fixed lender fee per draw", status: "More information needed" },
    { lender: "Commerce Growth Finance", model: "Equipment finance", amount: "USD 40,000", term: "24-month lease-to-own", collection: "Monthly scheduled repayment", status: "Invite required" },
  ];
  const assignedMerchants = [
    ["Stop & Shop", "Medium", "4", "125,420 USD", "98.7%", "+18%", "Inventory line", "Review"],
    ["Martha’s Market", "Small", "2", "48,250 USD", "99.2%", "+9%", "Working capital", "Eligible"],
    ["Kallon Building Supply", "Medium", "3", "214,800 USD", "97.6%", "+24%", "Equipment", "Manual review"],
    ["Red Light Pharmacy", "Small", "1", "36,400 USD", "99.8%", "+6%", "Inventory", "Eligible"],
  ];
  const structures = [
    ["Revenue-based finance", "Repayment varies with verified eligible settlements", "Custom share · custom cap · custom term"],
    ["Revolving inventory line", "Approved draws for verified inventory purchases", "Draw limit · cycle fee · renewal rules"],
    ["Fixed-term working capital", "Scheduled installments under the lender’s credit policy", "Principal · lender rate · repayment calendar"],
    ["Equipment finance", "Asset-linked financing with lender-defined security controls", "Deposit · term · ownership transfer rules"],
  ];

  if (role === "Merchant") return (
    <section className="workspace-stack merchant-financing">
      <PageIntro
        eyebrow="MERCHANT FINANCING"
        title="Financing matched to your verified business"
        copy="View offers only from lenders assigned to your merchant profile. Each lender sets its own products, pricing, limits, approval rules and repayment structure."
        action="Request financing"
        click={() => setAction("Request merchant financing")}
      />
      <section className="financing-principle">
        <Landmark />
        <div><small>PROSPEVA FACILITATES · THE LENDER DECIDES</small><h3>No universal financing structure</h3><p>Prospeva securely presents consented, verified business evidence. Assigned lenders independently assess the request, define terms and make the credit decision.</p></div>
        <i>Demo data</i>
      </section>
      <section className="financing-record-strip">
        <div><small>ORGANIZATION</small><b>Stop & Shop</b><em>ORG-MER-2081</em></div>
        <div><small>FINANCING REQUEST</small><b>MF-20418</b><em>COR-FIN-88421</em></div>
        <div><small>ELIGIBILITY</small><b className="good">Eligible to request</b><em>Not a credit approval</em></div>
        <div><small>PROFILE BOUNDARY</small><b>Merchant only</b><em>Agent and other profiles excluded</em></div>
      </section>
      <section className="financing-evidence-grid">
        {merchantEvidence.map(([label,value,note,Icon]) => <article key={label}><span><Icon /></span><div><small>{label}</small><b>{value}</b><em>{note}</em></div><BadgeCheck /></article>)}
      </section>
      <section className="financing-readiness">
        <article className="panel"><PanelHead eyebrow="AFFORDABILITY & OBLIGATIONS" title="Pre-routing controls" />{[
          ["Existing active financing","USD 0","Clear"],
          ["Pending applications","2 requests","Review"],
          ["Settlement-linked commitments","None","Clear"],
          ["Aged reconciliation breaks","0 material","Clear"],
          ["Compliance or fraud restrictions","No blocking hold","Clear"],
          ["Duplicate receivable financing","No duplicate found","Clear"],
        ].map(row=><p key={row[0]}><span>{row[0]}<small>{row[1]}</small></span><i className={row[2]==="Clear"?"clear":"review"}>{row[2]}</i></p>)}</article>
        <article className="panel merchant-purpose"><PanelHead eyebrow="MERCHANT-SPECIFIC EVIDENCE" title="Verified use and demand" />{[
          ["Supplier invoice","INV-SUP-8821 · USD 18,400"],
          ["Purchase order","PO-20491 · inventory restock"],
          ["Branch performance","4 branches · 3 active"],
          ["Seasonal demand","+18% four-week order trend"],
          ["Requested use","Inventory and branch expansion"],
        ].map(row=><p key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><BadgeCheck /></p>)}</article>
      </section>
      <Tabs defaultValue="lenders" className="control-tabs">
        <TabsList className="control-tab-list">
          <TabsTrigger value="lenders">Assigned lenders</TabsTrigger>
          <TabsTrigger value="requests">My requests</TabsTrigger>
          <TabsTrigger value="offers">Compare offers</TabsTrigger>
          <TabsTrigger value="evidence">Evidence vault</TabsTrigger>
          <TabsTrigger value="repayment">Servicing</TabsTrigger>
        </TabsList>
        <TabsContent value="lenders">
          <section className="financing-offer-grid">
            {lenderOffers.map((offer,index) => <article key={offer.lender}>
              <header><span><Landmark /></span><div><small>ASSIGNED LENDER · DEMO</small><h3>{offer.lender}</h3></div><i className={index===0?"ready":index===1?"review":"invite"}>{offer.status}</i></header>
              <div className="financing-model"><small>FINANCING STRUCTURE</small><b>{offer.model}</b><p>{offer.amount} · {offer.term}</p></div>
              <dl><div><dt>Collection</dt><dd>{offer.collection}</dd></div><div><dt>Decision owner</dt><dd>{offer.lender}</dd></div><div><dt>Prospeva role</dt><dd>Evidence, routing and servicing support</dd></div></dl>
              <button onClick={() => index===0 ? setAction("Request merchant financing") : notify(`${offer.lender} requirements opened`)}>{index===0?"Start application":"View requirements"}<ArrowRight /></button>
            </article>)}
          </section>
        </TabsContent>
        <TabsContent value="requests">
          <article className="panel financing-request-list">
            <PanelHead eyebrow="APPLICATIONS" title="Merchant financing requests" action="New request" click={() => setAction("Request merchant financing")} />
            {[["MF-20418","Unity Bank","Inventory financing","USD 25,000","Lender review"],["MF-20372","Monrovia SME Fund","Working capital","USD 12,000","Information required"]].map(r=><button key={r[0]} onClick={()=>notify(`${r[0]} application opened`)}><code>{r[0]}</code><div><b>{r[2]}</b><small>{r[1]}</small></div><strong>{r[3]}</strong><i>{r[4]}</i><ChevronRight /></button>)}
          </article>
        </TabsContent>
        <TabsContent value="offers">
          <section className="offer-comparison">
            <article className="panel offer-comparison-table"><PanelHead eyebrow="LENDER OFFERS" title="Compare complete financing cost" />
              <div className="offer-compare-head"><b>Terms</b><b>Unity Bank</b><b>Monrovia SME Fund</b></div>
              {[
                ["Approved amount","USD 25,000","USD 12,000"],
                ["Total repayment","USD 28,250 cap","USD 13,080"],
                ["Lender charge","Revenue share to cap","9% per draw"],
                ["Prospeva / partner fee","USD 0 / USD 75","USD 0 / USD 40"],
                ["Term","Up to 18 months","90 days"],
                ["Payment frequency","Eligible settlements","End-of-cycle schedule"],
                ["Security","Settlement assignment","Inventory invoice"],
                ["Early repayment","No penalty","No penalty"],
                ["Offer expires","Sep 30, 2026","Oct 5, 2026"],
              ].map(row=><div key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><b>{row[2]}</b></div>)}
            </article>
            <article className="panel financing-offer-review"><FileCheck2 /><div><small>SELECTED OFFER · MF-20418-O1</small><h3>Revenue-based financing offer</h3><p>Unity Bank · version 2 · employer acceptance and independent approval still required.</p></div><button onClick={()=>setAction("Review financing offer")}>Review and accept</button></article>
          </section>
        </TabsContent>
        <TabsContent value="evidence">
          <section className="financing-vault">
            <article className="panel"><PanelHead eyebrow="CONSENTED DOCUMENTS" title="Financing evidence vault" action="Add document" click={()=>notify("Secure financing document upload opened")} />{[
              ["KYB and beneficial owners","Verified","Shared under consent v3"],
              ["Financial statements","FY2025","Lender access granted"],
              ["Settlement history","12 months","Generated by Prospeva"],
              ["Supplier invoice and purchase order","2 documents","Purpose restricted"],
              ["Financing agreement","Not signed","Awaiting final offer"],
              ["Repayment schedule","Draft","Lender version 2"],
            ].map(row=><button key={row[0]} onClick={()=>notify(`${row[0]} opened`)}><FolderLock /><span><b>{row[0]}</b><small>{row[1]}</small></span><i>{row[2]}</i><ChevronRight /></button>)}</article>
            <article className="panel consent-ledger"><PanelHead eyebrow="CONSENT & ACCESS" title="Who can see this evidence" />{[
              ["Unity Bank","Active","Expires Oct 31, 2026"],
              ["Monrovia SME Fund","Active","Expires Oct 15, 2026"],
              ["Commerce Growth Finance","Not granted","No document access"],
            ].map(row=><p key={row[0]}><Landmark /><span><b>{row[0]}</b><small>{row[2]}</small></span><i>{row[1]}</i></p>)}<button onClick={()=>setAction("Manage financing consent")}>Manage consent</button></article>
          </section>
        </TabsContent>
        <TabsContent value="repayment">
          <section className="financing-servicing">
            <article className="panel servicing-summary"><PanelHead eyebrow="DEMO ACTIVE FACILITY" title="Unity Bank revenue-based finance" />
              <div className="servicing-kpis">{[["Original amount","USD 25,000"],["Principal outstanding","USD 19,420"],["Lender charges","USD 1,386"],["Collected","USD 6,966"],["Next review","Oct 1, 2026"],["Past due","USD 0"]].map(row=><div key={row[0]}><small>{row[0]}</small><b>{row[1]}</b></div>)}</div>
              <div className="servicing-meter"><span><i style={{width:"24%"}} /></span><p><b>24% collected</b><small>Settlement-linked deductions reconciled through Sep 20</small></p></div>
              <div className="servicing-actions"><button onClick={()=>notify("Financing statement prepared")}><Download />Download statement</button><button onClick={()=>setAction("Dispute financing repayment")}><AlertTriangle />Report an issue</button><button onClick={()=>setAction("Request financing hardship support")}><HeartPulse />Request hardship support</button></div>
            </article>
            <article className="panel repayment-history"><PanelHead eyebrow="REPAYMENT HISTORY" title="Settlement-linked collections" />{[["Sep 20","SET-88420","USD 642","Reconciled"],["Sep 13","SET-88204","USD 588","Reconciled"],["Sep 6","SET-87982","USD 604","Reconciled"]].map(row=><button key={row[1]} onClick={()=>notify(`${row[1]} opened`)}><span><b>{row[0]}</b><small>{row[1]}</small></span><strong>{row[2]}</strong><i>{row[3]}</i><ChevronRight /></button>)}</article>
          </section>
        </TabsContent>
      </Tabs>
      <section className="financing-alerts panel"><PanelHead eyebrow="DEADLINES & NOTIFICATIONS" title="Financing attention center" />{[
        ["Evidence requested","Unity Bank needs the latest supplier invoice","Due Sep 24"],
        ["Offer expiration","MF-20418-O1 expires soon","Sep 30"],
        ["Upcoming repayment review","Settlement share review","Oct 1"],
      ].map(row=><button key={row[0]} onClick={()=>notify(`${row[0]} opened`)}><Bell /><span><b>{row[0]}</b><small>{row[1]}</small></span><i>{row[2]}</i><ChevronRight /></button>)}</section>
      <section className="financing-lifecycle" aria-label="Merchant financing lifecycle">
        {["Request","Consent","Evidence verified","Lender review","Offer","Merchant accepts","Disbursement","Repayment & monitoring"].map((step,index)=><span key={step}><i>{index+1}</i><b>{step}</b></span>)}
      </section>
    </section>
  );

  return (
    <section className="workspace-stack merchant-financing">
      <PageIntro
        eyebrow="LENDER MERCHANT FINANCING"
        title="Assigned merchant underwriting and portfolio"
        copy="Assess only merchants assigned to this lender. Apply your institution’s own products, pricing, approval levels, affordability rules and risk controls."
        action="Create financing structure"
        click={() => setAction("Create lender financing structure")}
      />
      <section className="financing-principle lender">
        <ShieldCheck />
        <div><small>LENDER POLICY CONTROLS</small><h3>Prospeva does not standardize your credit product</h3><p>Verified Prospeva data supports assessment. Your licensed lender remains responsible for underwriting, terms, disclosures, approval, funding, servicing, hardship and collections.</p></div>
        <i>Assigned merchants only</i>
      </section>
      <section className="financing-record-strip lender-records">
        <div><small>ACTIVE PORTFOLIO</small><b>18 facilities</b><em>USD 284,600 outstanding</em></div>
        <div><small>DECISIONS DUE</small><b>4 applications</b><em>2 manual reviews</em></div>
        <div><small>SERVICING</small><b className="good">96.8% current</b><em>1 hardship case</em></div>
        <div><small>ACCESS BOUNDARY</small><b>Assigned merchants</b><em>Consent and purpose enforced</em></div>
      </section>
      <Tabs defaultValue="portfolio" className="control-tabs">
        <TabsList className="control-tab-list">
          <TabsTrigger value="portfolio">Assigned merchants</TabsTrigger>
          <TabsTrigger value="underwriting">Underwriting evidence</TabsTrigger>
          <TabsTrigger value="structures">Financing structures</TabsTrigger>
          <TabsTrigger value="offers">Offers & monitoring</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio">
          <article className="panel merchant-portfolio">
            <div className="panel-head"><div><small>ASSIGNED PORTFOLIO</small><h3>Merchant financing opportunities</h3></div><div className="search-box"><Search /><input aria-label="Search assigned merchants" placeholder="Merchant, request or organization ID" /></div></div>
            <div className="merchant-finance-table"><div className="head"><b>Merchant</b><b>Size / branches</b><b>Verified sales</b><b>Settlement</b><b>Demand</b><b>Requested product</b><b>Assessment</b></div>{assignedMerchants.map(r=><button key={r[0]} onClick={()=>setAction(`Review merchant application · ${r[0]}`)}>{[r[0],`${r[1]} · ${r[2]}`,r[3],r[4],r[5],r[6],r[7]].map((x,i)=><span key={`${r[0]}-${i}`} data-label={["Merchant","Size / branches","Verified sales","Settlement","Demand","Requested product","Assessment"][i]}>{i===6?<em className={x==="Eligible"?"eligible":"review"}>{x}</em>:x}</span>)}</button>)}</div>
          </article>
        </TabsContent>
        <TabsContent value="underwriting">
          <section className="underwriting-layout">
            <article className="panel"><PanelHead eyebrow="VERIFIED FINANCIAL INFORMATION" title="Stop & Shop evidence pack" />{merchantEvidence.map(([label,value,note,Icon])=><div className="underwriting-row" key={label}><Icon /><span><b>{label}</b><small>{note}</small></span><strong>{value}</strong><BadgeCheck /></div>)}</article>
            <article className="panel underwriting-decision"><small>DECISION FRAMEWORK</small><h3>Evidence-based, lender-owned decision</h3>{["Verify KYB and beneficial owners","Confirm merchant consent and purpose","Assess cash flow and existing obligations","Apply product-specific affordability rules","Review fraud, sanctions and risk signals","Set conditions, pricing and approval level"].map((x,i)=><p key={x}><i>{i+1}</i>{x}</p>)}<button onClick={()=>setAction("Prepare merchant financing offer")}>Prepare governed offer</button></article>
          </section>
        </TabsContent>
        <TabsContent value="structures">
          <section className="financing-structure-grid">{structures.map((s,index)=><article key={s[0]}><header><span>{index+1}</span><i>{index===0?"Active":"Draft"}</i></header><h3>{s[0]}</h3><p>{s[1]}</p><small>{s[2]}</small><button onClick={()=>setAction(`Configure ${s[0]}`)}>Configure structure<ChevronRight /></button></article>)}</section>
        </TabsContent>
        <TabsContent value="offers">
          <section className="lender-monitoring-grid">
            <article className="panel financing-request-list"><PanelHead eyebrow="PIPELINE" title="Merchant financing offers" />{[["MFO-9021","Stop & Shop","Revenue-based finance","USD 25,000","Lender review"],["MFO-9017","Martha’s Market","Inventory line","USD 10,000","Merchant review"],["MFO-8998","Red Light Pharmacy","Inventory line","USD 8,500","Approved"]].map(r=><button key={r[0]} onClick={()=>notify(`${r[0]} offer opened`)}><code>{r[0]}</code><div><b>{r[1]}</b><small>{r[2]}</small></div><strong>{r[3]}</strong><i>{r[4]}</i><ChevronRight /></button>)}</article>
            <article className="panel"><PanelHead eyebrow="SERVICING & HARDSHIP" title="Portfolio attention" />{[
              ["Stop & Shop","Current","Next review Oct 1"],
              ["Kallon Building Supply","Hardship requested","Case HC-2041"],
              ["Martha’s Market","Payment due","Due Sep 28"],
            ].map(row=><button className="portfolio-attention-row" key={row[0]} onClick={()=>setAction(`Service merchant financing · ${row[0]}`)}><span><b>{row[0]}</b><small>{row[2]}</small></span><i>{row[1]}</i><ChevronRight /></button>)}<button className="primary-button compact" onClick={()=>notify("Financing servicing queue opened")}>Open servicing queue</button></article>
          </section>
        </TabsContent>
      </Tabs>
      <section className="panel financing-governance"><LockKeyhole /><div><b>Separation of duties enforced</b><p>The analyst may recommend terms but cannot self-approve a sensitive credit decision. Offer versions, evidence, reviewers and execution status remain auditable.</p></div><button onClick={()=>notify("Merchant financing policy opened")}>View policy</button></section>
    </section>
  );
}

function EligibilityConsent({ role, notify, setAction }: any) {
  const [filter, setFilter] = useState("all");
  const records = [
    [
      "Kelvin Fallah",
      "Verified",
      "Active · biweekly",
      "Active",
      "Eligibility assessed",
      "Eligible",
    ],
    [
      "Martha Konah",
      "Not linked",
      "None",
      "Not requested",
      "Not assessed",
      "Marketplace unavailable",
    ],
    [
      "Samuel Tamba",
      "Former employer",
      "Inactive",
      "Expired",
      "Previously assessed",
      "New offers blocked",
    ],
    [
      "Hawa Sheriff",
      "Verified",
      "Active · monthly",
      "Active",
      "Pre-approved",
      "Underwriting",
    ],
    [
      "Fatu Brown",
      "Not linked",
      "None",
      "Not requested",
      "Not assessed",
      "Marketplace unavailable",
    ],
  ];
  if (role !== "Lender")
    return (
      <section className="eligibility-workspace">
        <div className="eligibility-policy">
          <ShieldCheck />
          <span>
            <small>EMPLOYEE LENDING CONTROL</small>
            <h2>Loan access depends on verified payroll employment</h2>
            <p>
              This organization profile does not receive employee underwriting
              data. Switch to an approved Lender profile to review consented
              applications.
            </p>
          </span>
        </div>
        <button
          className="secondary"
          onClick={() => notify("The approved Lender workspace is required")}
        >
          View access policy
        </button>
      </section>
    );
  const shown = records.filter(
    (r) =>
      filter === "all" ||
      (filter === "eligible"
        ? /Eligible|Underwriting/.test(r[5])
        : filter === "standalone"
          ? r[1] === "Not linked"
          : /blocked|unavailable/i.test(r[5])),
  );
  return (
    <section className="eligibility-workspace">
      <div className="eligibility-policy">
        <ShieldCheck />
        <span>
          <small>HARD ELIGIBILITY RULE</small>
          <h2>Personal account does not mean loan approval</h2>
          <p>
            Only verified employees whose employers process active payroll
            through Prospeva can be assessed. Consent and lender underwriting
            remain mandatory.
          </p>
        </span>
      </div>
      <div className="eligibility-sequence">
        {[
          "Personal account",
          "Employer verified",
          "Payroll confirmed",
          "Consent obtained",
          "Eligibility assessed",
          "Pre-approved",
          "Lender underwriting",
          "Approved / declined",
        ].map((s, i) => (
          <span key={s}>
            <i>{i + 1}</i>
            <b>{s}</b>
            {i < 7 && <ChevronRight />}
          </span>
        ))}
      </div>
      <div className="workspace-heading">
        <span>
          <small>CONSENTED EMPLOYEE PIPELINE</small>
          <h2>Loan access controls</h2>
        </span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="eligible">Eligible employees</SelectItem>
            <SelectItem value="standalone">
              Standalone personal accounts
            </SelectItem>
            <SelectItem value="blocked">Blocked or unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="eligibility-table">
        <div className="eligibility-row head">
          <b>User</b>
          <b>Employer link</b>
          <b>Payroll</b>
          <b>Consent</b>
          <b>Assessment</b>
          <b>Marketplace status</b>
        </div>
        {shown.map((r) => (
          <button
            className="eligibility-row"
            key={r[0]}
            onClick={() => setAction(`Eligibility · ${r[0]}`)}
          >
            {r.map((x, i) => (
              <span
                key={i}
                data-label={
                  [
                    "User",
                    "Employer link",
                    "Payroll",
                    "Consent",
                    "Assessment",
                    "Marketplace status",
                  ][i]
                }
              >
                {i === 5 ? (
                  <em
                    className={
                      /Eligible|Underwriting/.test(x) ? "good" : "blocked"
                    }
                  >
                    {x}
                  </em>
                ) : (
                  x
                )}
              </span>
            ))}
          </button>
        ))}
      </div>
      <div className="eligibility-footer">
        <LockKeyhole />
        <span>
          <b>Lender privacy boundary</b>
          <small>
            Only authorized employee data is shown. Standalone personal activity
            is not exposed, and access expires automatically.
          </small>
        </span>
        <button
          className="secondary"
          onClick={() => notify("Consent audit opened")}
        >
          Review consent audit
        </button>
      </div>
    </section>
  );
}

function AuthExperience({
  view,
  setView,
  role,
  setRole,
  email,
  setEmail,
  password,
  setPassword,
  signupStep,
  setSignupStep,
}: any) {
  const OrgIcon = roleData[role as Role].icon;
  const [otp, setOtp] = useState("482931");
  return (
    <main className="auth-shell">
      <section className="auth-story">
        <Logo light />
        <div className="auth-copy">
          <span>ONE PROSPEVA ID</span>
          <h1>
            Move money.
            <br />
            Run your organization.
          </h1>
          <p>
            Access the same approved organization profile from the Prospeva
            mobile app or this business portal.
          </p>
        </div>
        <div className="role-cloud">
          {roles.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="auth-trust">
          <ShieldCheck />
          <span>
            <b>Built for financial operations</b>
            <small>
              Separate balances, permissions and audit trails for every
              organization.
            </small>
          </span>
        </div>
      </section>
      <section className="auth-panel">
        <div className="mobile-auth-logo">
          <Logo />
        </div>
        {view === "mfa" ? (
          <div className="auth-card mfa-card">
            <span className="eyebrow">TWO-STEP VERIFICATION</span>
            <h2>Confirm it’s you</h2>
            <p>
              Enter the six-digit code sent to your registered Prospeva device
              ending in ••48.
            </p>
            <div className="mfa-shield">
              <ShieldCheck />
              <span>
                <b>Secure sign-in</b>
                <small>
                  {email} · {roleData[role as Role].name}
                </small>
              </span>
            </div>
            <label>
              Verification code
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                containerClassName="otp-row"
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="otp-slot"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </label>
            <label className="trusted-device">
              <input type="checkbox" defaultChecked />
              <span>
                <b>Trust this device for 30 days</b>
                <small>You can revoke it from Organization control.</small>
              </span>
            </label>
            <button
              className="primary-button"
              disabled={otp.length !== 6}
              onClick={() => setView("portal")}
            >
              Verify and continue <ArrowRight />
            </button>
            <button className="text-button" onClick={() => setView("signin")}>
              Back to sign in
            </button>
          </div>
        ) : view === "signin" ? (
          <div className="auth-card">
            <span className="eyebrow">PROSPEVA BUSINESS PORTAL</span>
            <h2>Welcome back</h2>
            <p>Use the Prospeva credentials you created on mobile or web.</p>
            <div className="auth-demo-note"><Database/><span><b>Prototype access</b><small>Demo records only · shared backend and external providers are not connected.</small></span></div>
            <label>
              Email or phone
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Password
              <div className="password-field">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <LockKeyhole />
              </div>
            </label>
            <div className="auth-options">
              <label>
                <input type="checkbox" defaultChecked />
                Remember this device
              </label>
              <button>Forgot password?</button>
            </div>
            <button
              className="primary-button"
              disabled={!email || !password}
              onClick={() => setView("mfa")}
            >
              Sign in securely <ArrowRight />
            </button>
            <div className="identity-note">
              <Smartphone />
              <span>
                <b>Already use the mobile app?</b>
                <small>
                  Your approved organization workspaces will appear
                  automatically after identity verification.
                </small>
              </span>
            </div>
            <button
              className="text-button"
              onClick={() => {
                setView("signup");
                setSignupStep(1);
              }}
            >
              Create an organization account
            </button>
            <div className="personal-warning">
              <X />
              <span>
                <b>Personal accounts are mobile-only</b>
                <small>
                  This portal is exclusively for approved organizations and
                  authorized staff.
                </small>
              </span>
            </div>
          </div>
        ) : (
          <div className="auth-card signup-card">
            <span className="eyebrow">
              ORGANIZATION ONBOARDING · STEP {signupStep} OF 2
            </span>
            <h2>
              {signupStep === 1
                ? "Tell us about your organization"
                : "Create the authorized officer"}
            </h2>
            {signupStep === 1 ? (
              <>
                <label>
                  Organization type
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as Role)}
                  >
                    <SelectTrigger className="auth-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                <label>
                  Legal organization name
                  <input
                    placeholder="Registered name"
                    defaultValue={roleData[role as Role].name}
                  />
                </label>
                <label>
                  Registration or license number
                  <input placeholder="LBR registration number" />
                </label>
                <button
                  className="primary-button"
                  onClick={() => setSignupStep(2)}
                >
                  Continue <ArrowRight />
                </button>
              </>
            ) : (
              <>
                <div className="selected-org">
                  <OrgIcon />
                  <span>
                    <b>{roleData[role as Role].name}</b>
                    <small>{role} · Pending verification</small>
                  </span>
                </div>
                <label>
                  Authorized officer name
                  <input defaultValue="Kelvin Fallah" />
                </label>
                <label>
                  Work email
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label>
                  Create password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <button
                  className="primary-button"
                  onClick={() => setView("mfa")}
                >
                  Create Prospeva ID <ShieldCheck />
                </button>
                <button
                  className="back-button"
                  onClick={() => setSignupStep(1)}
                >
                  Back
                </button>
              </>
            )}
            <button className="text-button" onClick={() => setView("signin")}>
              Already have a Prospeva ID? Sign in
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function AgentWorkspace({
  page,
  notify,
}: {
  page: string;
  notify: (message: string) => void;
}) {
  const [lrdCash, setLrdCash] = useState(true);
  const [usdCash, setUsdCash] = useState(true);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const validate = () => {
    if (code.replace(/\D/g, "") === "482917") {
      setVerified(true);
      notify("Customer code verified — withdrawal details loaded");
    } else notify("Code not found or expired. Try demo code 482917");
  };
  if (page === "Withdrawals")
    return (
      <section className="agent-workspace">
        <PageIntro
          eyebrow="CUSTOMER WITHDRAWAL"
          title="Validate the customer’s six-digit code"
          copy="The code is single-use, bound to the customer and amount, and expires after 15 minutes."
        />
        <div className="agent-two-col">
          <article className="panel agent-code-panel">
            <PanelHead eyebrow="SECURE HANDOFF" title="Customer Code" />
            <label>
              Enter six-digit code
              <div className="agent-code-entry">
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setVerified(false);
                  }}
                  inputMode="numeric"
                  placeholder="000000"
                />
                <button onClick={validate} disabled={code.length !== 6}>
                  Validate code
                </button>
              </div>
            </label>
            <small>Demo code: 482917 · Never ask for the customer’s PIN.</small>
          </article>
          <article
            className={`panel agent-autofill ${verified ? "verified" : ""}`}
          >
            <PanelHead
              eyebrow="AUTO-FILLED REQUEST"
              title={
                verified ? "Ready for cash handoff" : "Waiting for validation"
              }
            />
            {verified ? (
              <>
                <div className="agent-person">
                  <span>KF</span>
                  <div>
                    <b>Kelvin Fallah</b>
                    <small>
                      Verified Prospeva customer · Photo match required
                    </small>
                  </div>
                  <BadgeCheck />
                </div>
                <ReviewRow label="Withdrawal" value="1,000 LRD" />
                <ReviewRow label="Agent fee" value="25 LRD" />
                <ReviewRow label="Code expiry" value="12:41 remaining" />
                <button
                  className="primary-button"
                  onClick={() =>
                    notify("Withdrawal confirmed and receipt sent to Kelvin")
                  }
                >
                  Confirm cash handed to customer
                </button>
              </>
            ) : (
              <div className="agent-empty">
                <LockKeyhole />
                <p>
                  Customer and amount remain hidden until a valid code is
                  entered.
                </p>
              </div>
            )}
          </article>
        </div>
      </section>
    );
  if (page === "Cash In")
    return (
      <section className="agent-workspace">
        <PageIntro
          eyebrow="CASH IN"
          title="Accept a verified customer deposit"
          copy="Scan the QR pass or enter the customer’s one-time deposit code, count the cash, and confirm the wallet credit."
          action="Scan QR"
          click={() => notify("QR scanner opened")}
        />
        <article className="panel agent-cash-form">
          <label>
            Customer deposit code
            <input defaultValue="731204" inputMode="numeric" maxLength={6} />
          </label>
          <label>
            Cash counted
            <input defaultValue="1,000" inputMode="decimal" />
          </label>
          <label>
            Currency
            <select defaultValue="LRD">
              <option>LRD</option>
              <option>USD</option>
            </select>
          </label>
          <button
            className="primary-button"
            onClick={() =>
              notify("Deposit verified and customer wallet credited")
            }
          >
            Verify and credit customer
          </button>
        </article>
      </section>
    );
  if (page === "Commissions")
    return (
      <section className="agent-workspace">
        <PageIntro
          eyebrow="AGENT ECONOMICS"
          title="Commissions and float"
          copy="Track earnings, request digital float and return excess physical cash through an approved settlement point."
        />
        <div className="agent-stat-grid">
          <Metric
            icon={CircleDollarSign}
            tone="green"
            label="Today"
            value="4,850 LRD"
            note="84 completed transactions"
          />
          <Metric
            icon={TrendingUp}
            tone="blue"
            label="This week"
            value="28,750 LRD"
            note="+8.4% vs last week"
          />
          <Metric
            icon={WalletCards}
            tone="orange"
            label="Digital float"
            value="485,000 LRD"
            note="6,250 USD also available"
          />
        </div>
        <div className="agent-economics-actions">
          <button onClick={() => notify("Float top-up request opened")}>
            <Plus />
            <span>
              <b>Request Float Top-Up</b>
              <small>Send a funding request for LRD or USD float</small>
            </span>
            <ChevronRight />
          </button>
          <button onClick={() => notify("Excess cash deposit workflow opened")}>
            <UploadCloud />
            <span>
              <b>Deposit Excess Cash</b>
              <small>Reserve a bank or super-agent settlement window</small>
            </span>
            <ChevronRight />
          </button>
        </div>
      </section>
    );
  return (
    <section className="agent-workspace">
      <PageIntro
        eyebrow="AUTHORIZED PROSPEVA AGENT"
        title="Cash availability and customer service"
        copy="Availability updates are reflected in the customer Find Agent experience."
      />
      <div className="agent-live-grid">
        <article className="agent-cash-toggle">
          <span>
            <small>REAL-TIME CASH STATUS</small>
            <h3>What can customers collect now?</h3>
          </span>
          <label>
            <div>
              <b>LRD cash</b>
              <small>
                {lrdCash ? "Available · 620,000 LRD" : "Out of cash"}
              </small>
            </div>
            <Switch
              checked={lrdCash}
              onCheckedChange={(v) => {
                setLrdCash(v);
                notify(`LRD cash ${v ? "available" : "marked out of cash"}`);
              }}
            />
          </label>
          <label>
            <div>
              <b>USD cash</b>
              <small>{usdCash ? "Available · 8,450 USD" : "Out of cash"}</small>
            </div>
            <Switch
              checked={usdCash}
              onCheckedChange={(v) => {
                setUsdCash(v);
                notify(`USD cash ${v ? "available" : "marked out of cash"}`);
              }}
            />
          </label>
          <div
            className={`agent-status ${lrdCash || usdCash ? "online" : "offline"}`}
          >
            <i />
            {lrdCash || usdCash
              ? "Visible in Find Agent"
              : "Hidden from cash-available results"}
          </div>
        </article>
        <article className="panel">
          <PanelHead eyebrow="TODAY" title="Service snapshot" />
          <ReviewRow label="Cash reservations" value="5 waiting" />
          <ReviewRow label="Completed withdrawals" value="31" />
          <ReviewRow label="Customer deposits" value="53" />
          <ReviewRow label="Commissions earned" value="4,850 LRD" />
        </article>
      </div>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="agent-review-row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function Overview({ role, data, setAction, navigate, notify }: any) {
  const quick =
    role === "Lender"
      ? [
          ["Review requests", FileText],
          ["Create credit offer", HandCoins],
          ["Fund wallet", Plus],
          ["Collect repayment", QrCode],
        ]
      : role === "Prospeva Agent"
        ? [
            ["Customer cash-in", Plus],
            ["Cash withdrawal", Banknote],
            ["Scan customer code", QrCode],
            ["Reconcile float", RefreshCw],
          ]
        : [
            [
              role === "Merchant" ? "Tap on Phone" : "Collect payment",
              role === "Merchant" ? SmartphoneNfc : QrCode,
            ],
            ["Create PayLink", Link2],
            ["Send invoice", FileText],
            ["Withdraw funds", Banknote],
          ];
  return (
    <>
      <section className="welcome-row">
        <div>
          <span>
            <data.icon />
          </span>
          <div>
            <small>VERIFIED {role.toUpperCase()}</small>
            <h2>{data.name}</h2>
            <p>{data.headline}</p>
          </div>
        </div>
        <button onClick={() => navigate("Connections")}>
          <Network />
          Manage connections
        </button>
      </section>
      <section className="balance-grid">
        <article className="balance-card">
          <div>
            <small>AVAILABLE ACROSS WALLETS</small>
            <h3>{data.balance}</h3>
            <p>{data.secondary}</p>
          </div>
          <button onClick={() => notify("Balances protected")}>
            <WalletCards />
          </button>
          <footer>
            <span>
              <i />
              Demo cleared balance
            </span>
            <button onClick={() => setAction("Move money")}>
              Move money <ArrowRight />
            </button>
          </footer>
        </article>
        <Metric
          icon={Activity}
          tone="green"
          label={data.metricLabel}
          value={data.metric}
          note="+12.4% from last period"
        />
        <Metric
          icon={Clock3}
          tone="orange"
          label="Needs attention"
          value={data.pending}
          note="Review now"
          click={() => navigate("Approvals")}
        />
        <Metric
          icon={Users}
          tone="blue"
          label={data.peopleLabel}
          value={data.people}
          note="Open directory"
          click={() => navigate("People & accounts")}
        />
      </section>
      <section className="quick-section">
        <div className="section-heading">
          <div>
            <small>QUICK ACTIONS</small>
            <h3>What do you need to do?</h3>
          </div>
          <span>Permission-controlled</span>
        </div>
        <div className="quick-grid">
          {quick.map(([label, Icon]: any) => (
            <button key={label} onClick={() => setAction(label)}>
              <span>
                <Icon />
              </span>
              <b>{label}</b>
              <small>Open secure workflow</small>
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>
      <RoleWorkspace
        role={role}
        notify={notify}
        setAction={setAction}
        navigate={navigate}
      />
      <section className="dashboard-lower">
        <article className="panel transactions-panel">
          <PanelHead
            eyebrow="DEMO ACTIVITY"
            title="Recent transactions"
            action="View all"
            click={() => navigate("Payments & billing")}
          />
          <RecordsTable records={data.records} open={setAction} />
        </article>
        <article className="panel cashflow-panel">
          <PanelHead
            eyebrow="7-DAY VIEW"
            title="Money movement"
            icon={BarChart3}
          />
          <div className="bars">
            {[46, 72, 55, 88, 64, 94, 79].map((v, i) => (
              <span key={i}>
                <i style={{ height: `${v}%` }} />
                <small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small>
              </span>
            ))}
          </div>
          <div className="cashflow-totals">
            <span>
              <small>Money in</small>
              <b>+48,250 USD</b>
            </span>
            <span>
              <small>Money out</small>
              <b>−21,840 USD</b>
            </span>
          </div>
        </article>
      </section>
      <section className="smart-route-banner">
        <span>
          <Sparkles />
        </span>
        <div>
          <small>PROSPEVA SMART ROUTE</small>
          <b>Route comparison preview—no external rail is active.</b>
          <p>
            Production quotes will include a quote ID, rule versions, fees,
            exchange rate, recipient amount and settlement estimate.
          </p>
        </div>
        <button onClick={() => setAction("Smart route details")}>
          View routing <ArrowRight />
        </button>
      </section>
    </>
  );
}

function RoleWorkspace({
  role,
  notify,
  setAction,
  navigate,
}: {
  role: Role;
  notify: (message: string) => void;
  setAction: (action: string) => void;
  navigate: (page: string) => void;
}) {
  const icons = [Boxes, ClipboardCheck, TrendingUp, Users];
  return (
    <section className="role-workspace">
      <div className="section-heading">
        <div>
          <small>{role.toUpperCase()} WORKSPACE</small>
          <h3>Purpose-built operations</h3>
        </div>
        <span>Demo organization data</span>
      </div>
      <div className="role-module-grid">
        {roleWorkspaces[role].map(([name, value, copy], index) => {
          const Icon = name === "Tap on Phone" ? SmartphoneNfc : icons[index];
          return (
            <button
              key={name}
              onClick={() =>
                name === "Tap on Phone"
                  ? setAction(name)
                  : navigate(`Workspace · ${name}`)
              }
            >
              <span>
                <Icon />
              </span>
              <div>
                <b>{name}</b>
                <strong>{value}</strong>
                <small>{copy}</small>
              </div>
              <ChevronRight />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Metric({ icon: Icon, tone, label, value, note, click }: any) {
  return (
    <article className="metric-card">
      <span className={`metric-icon ${tone}`}>
        <Icon />
      </span>
      <small>{label}</small>
      <strong>{value}</strong>
      {click ? (
        <button onClick={click}>
          {note} <ChevronRight />
        </button>
      ) : (
        <em>{note}</em>
      )}
    </article>
  );
}

function PanelHead({ eyebrow, title, action, click, icon: Icon }: any) {
  return (
    <div className="panel-head">
      <div>
        <small>{eyebrow}</small>
        <h3>{title}</h3>
      </div>
      {action ? (
        <button onClick={click}>{action}</button>
      ) : Icon ? (
        <button>
          <Icon />
        </button>
      ) : null}
    </div>
  );
}

function RecordsTable({ records, open }: any) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {records.map((row: string[], i: number) => (
            <tr key={row[0] + i}>
              <td>
                <span className="avatar">
                  {row[0].slice(0, 2).toUpperCase()}
                </span>
                {row[0]}
              </td>
              <td>{row[1]}</td>
              <td>{row[2]}</td>
              <td>
                <i className="status">{row[3]}</i>
              </td>
              <td>
                <button onClick={() => open(`${row[0]} transaction`)}>
                  <ChevronRight />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Connections({ notify }: any) {
  const list = [
    [
      "Partner bank",
      Landmark,
      "Cleared balance checks, settlements and automatic releases",
      "IIPS / NEPS",
      "Integration pending",
    ],
    [
      "Orange Money",
      Smartphone,
      "Collections, payouts and mobile-money settlement",
      "Mobile Payins",
      "Disabled",
    ],
    [
      "MTN MoMo",
      Smartphone,
      "Mobile wallet collections and disbursements",
      "Mobile Payins",
      "Disabled",
    ],
    [
      "Onafriq",
      Network,
      "Cards, payouts, remittances, VAS and mobile pay-ins",
      "API suite",
      "Certification required",
    ],
    [
      "PAPSS",
      RefreshCw,
      "African local-currency clearing and cross-border settlement",
      "Smart Route",
      "Certification required",
    ],
    [
      "Accounting system",
      BookOpen,
      "Sync invoices, settlements and reconciliation exports",
      "Finance tools",
      "Not configured",
    ],
  ] as const;
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="FINANCIAL CONNECTIONS"
        title="Connect the tools your organization uses"
        copy="Connection readiness is controlled centrally. This prototype does not represent an active provider or production integration."
        action="Request connection"
        click={() => notify("Connection request started")}
      />
      <div className="connection-grid">
        {list.map(([name, Icon, copy, badge, status]) => (
          <article key={name} className="connection-pending">
            <div className="connection-icon">
              <Icon />
            </div>
            <div className="connection-copy">
              <span>
                <b>{name}</b>
                <i>{badge}</i>
              </span>
              <p>{copy}</p>
            </div>
            <div className="connection-state">
              <small>{status}</small>
              <button onClick={() => notify(`${name} readiness details opened`)}>View readiness</button>
            </div>
          </article>
        ))}
      </div>
      <section className="panel security-panel">
        <ShieldCheck />
        <div>
          <h3>Connection governance</h3>
          <p>
            Only authorized officers can add financial connections. New
            connections require maker-checker approval, scoped permissions and a
            permanent audit record.
          </p>
        </div>
        <button onClick={() => notify("Connection audit opened")}>
          View audit log
        </button>
      </section>
    </section>
  );
}

function PageIntro({ eyebrow, title, copy, action, click }: any) {
  return (
    <div className="page-intro">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      {action && (
        <button className="primary-button compact" onClick={click}>
          <Plus />
          {action}
        </button>
      )}
    </div>
  );
}

function Approvals({ data, role, notify }: any) {
  const roleRequest =
    role === "Lender"
      ? "Employee credit offer"
      : role === "Susu Group"
        ? "Rotating member payout"
        : role === "Church"
          ? "Restricted ministry transfer"
          : role === "Landlord"
            ? "Tenant deposit release"
            : "Invoice write-off";
  const initial = useMemo(
    () => [
      ["AP-20418", "Withdrawal to partner bank", "25,000 USD", "Martha K."],
      [
        "AP-20419",
        "New staff settlement permission",
        "Role change",
        "James Doe",
      ],
      ["AP-20420", "Bulk payment batch", "485,000 LRD", "Samuel T."],
      ["AP-20421", roleRequest, "12,500 LRD", "Hawa S."],
      ["AP-20422", "Bank account change", "Security review", "Kelvin F."],
      ["AP-20423", "Fee adjustment", "85.00 USD", "Finance team"],
    ],
    [roleRequest],
  );
  const [items, setItems] = useState(
    initial.map((row) => ({ row, status: "Pending" })),
  );
  const [signing, setSigning] = useState<number | null>(null);
  const [otp, setOtp] = useState("");
  const decide = (index: number, status: string) => {
    setItems((all) =>
      all.map((item, i) => (i === index ? { ...item, status } : item)),
    );
    setSigning(null);
    setOtp("");
    notify(`Request ${status.toLowerCase()}`);
  };
  return (
    <section className="workspace-stack">
      <div className="page-intro">
        <div>
          <span>UNIFIED APPROVAL INBOX</span>
          <h2>Approvals for {data.name}</h2>
          <p>
            Payments, permissions, settlement changes and role-specific requests
            are protected by maker-checker controls.
          </p>
        </div>
        <div className="approval-count">
          <b>{items.filter((i) => i.status === "Pending").length}</b>
          <small>Awaiting decision</small>
        </div>
      </div>
      {signing !== null && (
        <section className="signing-panel">
          <KeyRound />
          <div>
            <b>Sign high-risk approval</b>
            <p>
              Enter the code from your registered Prospeva device to approve{" "}
              {items[signing].row[0]}.
            </p>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="otp-slot compact"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <button
            disabled={otp.length !== 6}
            onClick={() => decide(signing, "Approved")}
          >
            Confirm signature
          </button>
          <button className="close-sign" onClick={() => setSigning(null)}>
            <X />
          </button>
        </section>
      )}
      <div className="approval-list">
        {items.map((item, index) => (
          <article key={item.row[0]}>
            <div className="approval-icon">
              <ShieldCheck />
            </div>
            <div>
              <small>{item.row[0]}</small>
              <h3>{item.row[1]}</h3>
              <p>Requested by {item.row[3]} · Today · Full audit trail</p>
            </div>
            <strong>{item.row[2]}</strong>
            <i className={`decision ${item.status.toLowerCase()}`}>
              {item.status}
            </i>
            {item.status === "Pending" && (
              <div className="approval-actions">
                <button onClick={() => decide(index, "Rejected")}>
                  <X />
                  Reject
                </button>
                <button
                  onClick={() =>
                    index === 0 || index === 4
                      ? setSigning(index)
                      : decide(index, "Approved")
                  }
                >
                  <Check />
                  Approve
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      <section className="panel approval-policy">
        <div>
          <LockKeyhole />
          <span>
            <b>Approval policy enforced</b>
            <small>
              Two authorized officers and transaction signing are required above
              10,000 USD equivalent or for bank-account changes.
            </small>
          </span>
        </div>
        <button onClick={() => notify("Approval policy opened")}>
          Manage policy
        </button>
      </section>
    </section>
  );
}

function PayTools({ data, role, notify, setAction }: any) {
  const [view, setView] = useState<"receive" | "scan">("receive");
  const [currency, setCurrency] = useState<"LRD" | "USD">("LRD");
  const [amount, setAmount] = useState("5,000");
  const [mode, setMode] = useState("Open amount");
  const [purpose, setPurpose] = useState(`${role} payment`);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [recipient, setRecipient] = useState("Martha K. · Personal");
  const [payMethod, setPayMethod] = useState("Prospeva wallet");
  const numeric = Number(amount.replace(/,/g, "")) || 0;
  const feeRate =
    payMethod === "External card"
      ? 0.025
      : payMethod === "Mobile money"
        ? 0.01
        : payMethod === "Prospeva card"
          ? 0.005
          : 0;
  const fee = numeric * feeRate;
  const total = numeric + fee;
  const digits = currency === "USD" ? 2 : 0;
  const money = (value: number) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: 2,
    });
  const payload = `https://pay.prospeva.lr/qr?to=${encodeURIComponent(data.id)}&ccy=${currency}&type=${mode.startsWith("Open") ? "open" : "fixed"}&amount=${mode.startsWith("Open") ? "payer" : numeric}&purpose=${encodeURIComponent(purpose)}`;
  useEffect(() => {
    let active = true;
    QRCode.toDataURL(payload, {
      width: 720,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#071936", light: "#ffffff" },
    })
      .then((url) => active && setQrDataUrl(url))
      .catch(() => notify("QR could not be generated"));
    return () => {
      active = false;
    };
  }, [payload, notify]);
  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${data.id.toLowerCase()}-prospeva-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    notify("QR downloaded as a PNG image");
  };
  const share = async () => {
    try {
      if (navigator.share)
        await navigator.share({
          title: `${data.name} Prospeva QR`,
          text: `Pay ${data.name} securely`,
          url: payload,
        });
      else {
        await navigator.clipboard.writeText(payload);
        notify("QR payment link copied");
      }
    } catch {
      notify("Sharing closed");
    }
  };
  if (view === "scan")
    return (
      <section className="workspace-stack">
        <PageIntro
          eyebrow="UNIVERSAL QR SCANNER"
          title="Scan any Prospeva user or organization"
          copy="Verify the recipient, choose LRD or USD and review the full payment disclosure before paying."
        />
        <div className="qr-view-toggle">
          <button onClick={() => setView("receive")}>
            <QrCode />
            My QR
          </button>
          <button className="active">
            <Search />
            Scan QR
          </button>
        </div>
        <section className="scan-pay-grid">
          <article className="panel business-scanner">
            <div className="scan-frame">
              <QrCode />
            </div>
            <small>ALIGN PROSPEVA QR INSIDE THE FRAME</small>
            <label>
              Demo QR presented
              <select
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  setScanned(false);
                }}
              >
                {[
                  "Martha K. · Personal",
                  "Stop & Shop · Merchant",
                  "Grace Community Church · Church",
                  "Divine Academy · School",
                  "Fallah Properties · Landlord",
                  "Unity Bank · Lender",
                  "Monrovia Medical Center · Hospital",
                  "Forward Together · Susu Group",
                  "Prospeva Agent – Sinkor · Agent",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <button
              className="primary-button"
              onClick={() => {
                setScanned(true);
                notify(`${recipient} verified`);
              }}
            >
              Simulate QR scan
            </button>
          </article>
          <article className="panel scan-payment-review">
            <PanelHead
              eyebrow="PAYMENT DETAILS"
              title={scanned ? "Verified recipient" : "Waiting for scan"}
            />
            {scanned ? (
              <>
                <div className="verified-scan-recipient">
                  <BadgeCheck />
                  <span>
                    <b>{recipient.split(" · ")[0]}</b>
                    <small>
                      {recipient.split(" · ")[1]} · Verified Prospeva
                      destination
                    </small>
                  </span>
                </div>
                <label>
                  Pay currency
                  <div className="segmented">
                    <button
                      className={currency === "LRD" ? "active" : ""}
                      onClick={() => setCurrency("LRD")}
                    >
                      LRD
                    </button>
                    <button
                      className={currency === "USD" ? "active" : ""}
                      onClick={() => setCurrency("USD")}
                    >
                      USD
                    </button>
                  </div>
                </label>
                <label>
                  Amount
                  <div className="amount-input">
                    <input
                      value={amount}
                      onChange={(e) =>
                        setAmount(e.target.value.replace(/[^0-9.,]/g, ""))
                      }
                      inputMode="decimal"
                    />
                    <span>{currency}</span>
                  </div>
                </label>
                <label>
                  Payment method
                  <Select value={payMethod} onValueChange={setPayMethod}>
                    <SelectTrigger className="field-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Prospeva wallet",
                        "Prospeva card",
                        "External card",
                        "Mobile money",
                      ].map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                <div className="route-disclosure">
                  <div>
                    <Network />
                    <span>
                      <b>Payment disclosure</b>
                      <small>Recipient and charges verified</small>
                    </span>
                    <i>READY</i>
                  </div>
                  {[
                    [
                      "Payment rail",
                      payMethod === "External card"
                        ? "Onafriq Card Payins"
                        : payMethod === "Mobile money"
                          ? "Onafriq Mobile Payins"
                          : "Prospeva internal rail",
                    ],
                    ["Exchange rate", "No conversion"],
                    [
                      "Prospeva fee",
                      `${money(payMethod === "Prospeva card" ? fee : 0)} ${currency}`,
                    ],
                    [
                      "Partner / network fee",
                      `${money(payMethod === "Prospeva card" ? 0 : fee)} ${currency}`,
                    ],
                    ["Total payer debit", `${money(total)} ${currency}`],
                    ["Exact recipient amount", `${money(numeric)} ${currency}`],
                    [
                      "Settlement",
                      feeRate ? "Usually under 2 minutes" : "Instant",
                    ],
                  ].map(([k, v]) => (
                    <p key={k}>
                      <span>{k}</span>
                      <b>{v}</b>
                    </p>
                  ))}
                </div>
                <button
                  className="primary-button"
                  disabled={!numeric}
                  onClick={() =>
                    notify(`Payment to ${recipient.split(" · ")[0]} confirmed`)
                  }
                >
                  Review and pay <ShieldCheck />
                </button>
              </>
            ) : (
              <div className="scan-empty">
                <LockKeyhole />
                <p>
                  Recipient details remain hidden until a valid QR is scanned.
                </p>
              </div>
            )}
          </article>
        </section>
      </section>
    );
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="UNIVERSAL QR CENTER"
        title="Display, download or share your verified QR"
        copy={`Receive payments into the correct ${data.name} profile and LRD or USD wallet.`}
        action="Add item or service"
        click={() => setAction("Payment catalog")}
      />
      <div className="qr-view-toggle">
        <button className="active">
          <QrCode />
          My QR
        </button>
        <button onClick={() => setView("scan")}>
          <Search />
          Scan QR
        </button>
      </div>
      <section className="pay-tools-grid">
        <article className="panel create-payment">
          <PanelHead
            eyebrow="QR SETTINGS"
            title="Choose how to receive"
            icon={QrCode}
          />
          <label>
            Receiving wallet
            <div className="segmented">
              <button
                className={currency === "LRD" ? "active" : ""}
                onClick={() => setCurrency("LRD")}
              >
                LRD
              </button>
              <button
                className={currency === "USD" ? "active" : ""}
                onClick={() => setCurrency("USD")}
              >
                USD
              </button>
            </div>
          </label>
          <label>
            Amount behavior
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="field-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open amount">Open amount</SelectItem>
                <SelectItem value="Fixed amount">Fixed amount</SelectItem>
              </SelectContent>
            </Select>
          </label>
          {mode === "Fixed amount" && (
            <label>
              Amount
              <div className="amount-input">
                <input
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^0-9.,]/g, ""))
                  }
                />
                <span>{currency}</span>
              </div>
            </label>
          )}
          <label>
            Payment purpose
            <input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </label>
          <div className="qr-policy-note">
            <ShieldCheck />
            <span>
              <b>Profile-bound destination</b>
              <small>
                This QR credits only {data.name}. Personal and organization
                funds cannot mix.
              </small>
            </span>
          </div>
        </article>
        <article className="panel qr-preview enhanced">
          <div className="verified-line">
            <BadgeCheck />
            <span>
              <b>{data.name}</b>
              <small>
                {data.id} · Verified {role}
              </small>
            </span>
          </div>
          <button
            className="qr-visual-image"
            onClick={() => setExpanded(true)}
            aria-label="Display QR full screen"
          >
            {qrDataUrl ? (
              <img src={qrDataUrl} alt={`${data.name} Prospeva payment QR`} />
            ) : (
              <QrCode />
            )}
          </button>
          <strong>
            {mode === "Open amount"
              ? `Payer enters amount in ${currency}`
              : `${money(numeric)} ${currency}`}
          </strong>
          <p>{purpose}</p>
          <small>Tap the QR for full-screen display</small>
          <div className="qr-action-row">
            <button onClick={download} disabled={!qrDataUrl}>
              <Download />
              Download
            </button>
            <button onClick={share}>
              <Link2 />
              Share
            </button>
            <button
              onClick={() =>
                navigator.clipboard
                  .writeText(payload)
                  .then(() => notify("QR link copied"))
              }
            >
              <Copy />
              Copy link
            </button>
          </div>
        </article>
      </section>
      {expanded && (
        <div className="business-qr-overlay" role="dialog" aria-modal="true">
          <div className="business-qr-full">
            <button
              className="qr-close"
              onClick={() => setExpanded(false)}
              aria-label="Close"
            >
              ×
            </button>
            <Logo />
            <small>SCAN TO PAY</small>
            <h2>{data.name}</h2>
            <p>
              {data.id} · Verified {role}
            </p>
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt={`${data.name} full-screen payment QR`}
              />
            )}
            <strong>
              {mode === "Open amount"
                ? `Enter amount in ${currency}`
                : `${money(numeric)} ${currency}`}
            </strong>
            <button className="primary-button" onClick={download}>
              <Download />
              Download QR
            </button>
            <button className="back-button" onClick={share}>
              <Link2 />
              Share QR
            </button>
          </div>
        </div>
      )}
      <section className="panel catalog-panel">
        <PanelHead
          eyebrow="REUSABLE COLLECTIONS"
          title="Payment catalog"
          action="Manage catalog"
          click={() => setAction("Payment catalog")}
        />
        <div className="catalog-list">
          {[
            ["Standard payment", "Open amount", QrCode],
            ["Monthly service", "100.00 USD", ReceiptText],
            ["Priority payment", "25,000 LRD", Sparkles],
          ].map(([name, value, Icon]: any) => (
            <button key={name} onClick={() => notify(`${name} selected`)}>
              <span>
                <Icon />
              </span>
              <div>
                <b>{name}</b>
                <small>{value}</small>
              </div>
              <i>Active</i>
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function LegacyPayTools({ data, notify, setAction }: any) {
  const [currency, setCurrency] = useState("LRD");
  const [amount, setAmount] = useState("5,000");
  const [mode, setMode] = useState("Fixed amount");
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="COLLECT FROM ANYWHERE"
        title="PayLink & QR"
        copy={`Create reusable organization payment links or downloadable QR codes for ${data.name}.`}
        action="Add item or service"
        click={() => setAction("Payment catalog")}
      />
      <section className="pay-tools-grid">
        <article className="panel create-payment">
          <PanelHead
            eyebrow="NEW PAYMENT REQUEST"
            title="Set up collection"
            icon={QrCode}
          />
          <label>
            Currency
            <div className="segmented">
              <button
                className={currency === "LRD" ? "active" : ""}
                onClick={() => setCurrency("LRD")}
              >
                LRD
              </button>
              <button
                className={currency === "USD" ? "active" : ""}
                onClick={() => setCurrency("USD")}
              >
                USD
              </button>
            </div>
          </label>
          <label>
            Amount behavior
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="field-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fixed amount">Fixed amount</SelectItem>
                <SelectItem value="Open amount">Open amount</SelectItem>
                <SelectItem value="Catalog item">Catalog item</SelectItem>
              </SelectContent>
            </Select>
          </label>
          {mode !== "Open amount" && (
            <label>
              Amount
              <div className="amount-input">
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span>{currency}</span>
              </div>
            </label>
          )}
          <label>
            Purpose
            <input defaultValue="Organization payment" />
          </label>
          <button
            className="primary-button"
            onClick={() => notify("Secure payment request generated")}
          >
            Generate payment request <ArrowRight />
          </button>
        </article>
        <article className="panel qr-preview">
          <div className="verified-line">
            <BadgeCheck />
            <span>
              <b>{data.name}</b>
              <small>{data.id} · Verified</small>
            </span>
          </div>
          <div className="qr-visual">
            <QrCode />
          </div>
          <strong>
            {mode === "Open amount"
              ? `Enter amount in ${currency}`
              : `${amount} ${currency}`}
          </strong>
          <p>Scan with Prospeva or a supported payment app</p>
          <div>
            <button onClick={() => notify("QR downloaded")}>
              <Download />
              Download QR
            </button>
            <button onClick={() => notify("Payment link copied")}>
              <Link2 />
              Copy PayLink
            </button>
          </div>
        </article>
      </section>
      <section className="panel catalog-panel">
        <PanelHead
          eyebrow="REUSABLE COLLECTIONS"
          title="Payment catalog"
          action="Manage catalog"
          click={() => setAction("Payment catalog")}
        />
        <div className="catalog-list">
          {[
            ["Standard payment", "Open amount", QrCode],
            ["Monthly service", "100.00 USD", ReceiptText],
            ["Priority payment", "25,000 LRD", Sparkles],
          ].map(([name, value, Icon]: any) => (
            <button key={name} onClick={() => notify(`${name} selected`)}>
              <span>
                <Icon />
              </span>
              <div>
                <b>{name}</b>
                <small>{value}</small>
              </div>
              <i>Active</i>
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function FinancialOperations({ data, notify, setAction }: any) {
  const balances = [
    ["Prospeva LRD wallet", "4,850,000 LRD", "Demo balance", WalletCards],
    ["Prospeva USD wallet", "125,420 USD", "Demo balance", CircleDollarSign],
    ["Partner bank", "Not available", "Integration pending", Landmark],
    ["Mobile money settlement", "Not available", "Provider disabled", Smartphone],
  ] as const;
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="FINANCIAL OPERATIONS CENTER"
        title="Cash, wallets and settlement position"
        copy={`A prototype operating view of ${data.name}. Production balances and settlement positions will come from the shared backend.`}
        action="Move funds"
        click={() => setAction("Move funds")}
      />
      <div className="treasury-grid">
        {balances.map(([name, value, status, Icon]) => (
          <article key={name}>
            <span>
              <Icon />
            </span>
            <div>
              <small>{name}</small>
              <b>{value}</b>
              <em>{status}</em>
            </div>
            <button onClick={() => notify(`${name} details opened`)}>
              <ChevronRight />
            </button>
          </article>
        ))}
      </div>
      <section className="operations-grid">
        <article className="panel">
          <PanelHead
            eyebrow="14-DAY FORECAST"
            title="Expected cash position"
            icon={TrendingUp}
          />
          <div className="forecast">
            <div>
              <span>Today</span>
              <b>5.18M LRD equivalent</b>
            </div>
            <div>
              <span>Expected collections</span>
              <b className="positive">+1.42M LRD</b>
            </div>
            <div>
              <span>Scheduled payouts</span>
              <b className="negative">−860K LRD</b>
            </div>
            <div>
              <span>Projected</span>
              <b>5.74M LRD</b>
            </div>
          </div>
          <div className="forecast-line">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </article>
        <article className="panel">
          <PanelHead
            eyebrow="RAIL ECONOMICS"
            title="Fees and settlement"
            icon={Network}
          />
          <div className="rail-list">
            {[
              ["IIPS / NEPS", "Demo estimate", "Integration pending"],
              ["PAPSS", "Demo estimate", "Certification required"],
              ["Onafriq", "Demo estimate", "Certification required"],
              ["External cards", "Demo estimate", "Not configured"],
            ].map((r) => (
              <button key={r[0]} onClick={() => notify(`${r[0]} route opened`)}>
                <b>{r[0]}</b>
                <span>{r[1]}</span>
                <em>{r[2]}</em>
                <ChevronRight />
              </button>
            ))}
          </div>
        </article>
      </section>
      <section className="summary-strip">
        <div>
          <small>Reserved funds</small>
          <b>240,000 LRD</b>
        </div>
        <div>
          <small>Pending settlements</small>
          <b>3 · 18,450 USD</b>
        </div>
        <div>
          <small>Expected today</small>
          <b>685,000 LRD</b>
        </div>
        <div>
          <small>Unreconciled</small>
          <b className="warning-text">7 items</b>
        </div>
      </section>
    </section>
  );
}

function Billing({
  role,
  data,
  notify,
  setAction,
}: {
  role: Role;
  data: any;
  notify: any;
  setAction: any;
}) {
  const billingType: Record<Role, string> = {
    Merchant: "Sales invoices",
    Lender: "Repayment schedules",
    Hospital: "Patient invoices",
    School: "Tuition plans",
    "Susu Group": "Contribution schedules",
    "Prospeva Agent": "Agent receipts",
    Church: "Pledges and appeals",
    Landlord: "Rent schedules",
  };
  const [filter, setFilter] = useState("All");
  const [recurring, setRecurring] = useState(true);
  const [partial, setPartial] = useState(
    role === "Hospital" || role === "School",
  );
  const invoices = [
    ["INV-8421", "Martha K.", "32,000 LRD", "Due Sep 12", "Open"],
    ["INV-8420", "Samuel T.", "150.00 USD", "Paid today", "Paid"],
    ["INV-8419", "Hawa S.", "18,500 LRD", "Overdue 3 days", "Overdue"],
    ["INV-8418", "James Doe", "85.00 USD", "Due Sep 18", "Open"],
  ];
  const visible =
    filter === "All" ? invoices : invoices.filter((i) => i[4] === filter);
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="INVOICE & BILLING ENGINE"
        title={billingType[role]}
        copy={`Create, schedule and collect ${role.toLowerCase()} payments with LRD or USD settlement.`}
        action="Create invoice"
        click={() => setAction("Create invoice")}
      />
      <section className="billing-controls panel">
        <div>
          <ReceiptText />
          <span>
            <b>Recurring billing</b>
            <small>Automatically issue the next approved request</small>
          </span>
          <Switch
            checked={recurring}
            onCheckedChange={(v) => {
              setRecurring(v);
              notify(`Recurring billing ${v ? "enabled" : "paused"}`);
            }}
          />
        </div>
        <div>
          <HandCoins />
          <span>
            <b>Partial payments</b>
            <small>Accept approved installments against a balance</small>
          </span>
          <Switch checked={partial} onCheckedChange={setPartial} />
        </div>
        <div>
          <Bell />
          <span>
            <b>SMS reminders</b>
            <small>Send before due date and after missed payment</small>
          </span>
          <Switch
            defaultChecked
            onCheckedChange={(v) =>
              notify(`SMS reminders ${v ? "enabled" : "paused"}`)
            }
          />
        </div>
      </section>
      <article className="panel records-panel">
        <div className="panel-head">
          <div>
            <small>DEMO RECEIVABLES</small>
            <h3>Invoices and schedules</h3>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="table-filter">
              <Filter />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["All", "Open", "Paid", "Overdue"].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="invoice-list">
          {visible.map((row) => (
            <button key={row[0]} onClick={() => setAction(`${row[0]} invoice`)}>
              <span className="doc-icon">
                <FileText />
              </span>
              <div>
                <small>{row[0]}</small>
                <b>{row[1]}</b>
                <em>{row[3]}</em>
              </div>
              <strong>{row[2]}</strong>
              <i className={`decision ${row[4].toLowerCase()}`}>{row[4]}</i>
              <ChevronRight />
            </button>
          ))}
        </div>
      </article>
      <section className="summary-strip">
        <div>
          <small>Outstanding</small>
          <b>485,500 LRD</b>
        </div>
        <div>
          <small>Collected this month</small>
          <b>78%</b>
        </div>
        <div>
          <small>Overdue</small>
          <b className="warning-text">42,500 LRD</b>
        </div>
        <div>
          <small>Next automated run</small>
          <b>Sep 12 · 8:00 AM</b>
        </div>
      </section>
    </section>
  );
}

function OrganizationControl({ role, data, notify, setAction }: any) {
  const [staff] = useState([
    { name: "Kelvin Fallah", role: "Chief Executive Officer", active: true },
    { name: "Martha K.", role: "General Manager", active: true },
    { name: "James Doe", role: "Operations Manager", active: true },
    { name: "Hawa S.", role: "Viewer", active: false },
  ]);
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="ORGANIZATION CONTROL CENTER"
        title="People, permissions and operating rules"
        copy={`Manage ${data.name} without mixing organization access with a personal profile.`}
        action="Add staff member"
        click={() => setAction("Add staff member")}
      />
      <section className="executive-authority">
        {[["Chief Executive Officer","Full organization oversight","CEO"],["General Manager","People, operating policy and delegated approvals","GM"],["Operations Manager","Day-to-day staffing and responsibility assignments","OM"]].map(x=><article key={x[0]}><span>{x[2]}</span><div><b>{x[0]}</b><small>{x[1]}</small></div><ShieldCheck/></article>)}
      </section>
      <section className="lifecycle-actions" aria-label="Staff lifecycle actions">
        {[["Add & onboard",UserPlus],["Assign responsibility",ClipboardCheck],["Promote or transfer",TrendingUp],["Temporary delegation",KeyRound],["Suspend or offboard",LogOut]].map(([label,Icon]:any)=><button key={label} onClick={()=>setAction(label)}><Icon/><span>{label}</span></button>)}
      </section>
      <Tabs defaultValue="staff" className="control-tabs">
        <TabsList className="control-tab-list">
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="roles">Roles & limits</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="staff">
          <section className="panel">
            <PanelHead
              eyebrow="AUTHORIZED USERS"
              title="Staff access"
              action="Invite staff"
              click={() => setAction("Add staff member")}
            />
            <div className="staff-list">
              {staff.map((person) => (
                <article key={person.name}>
                  <span className="avatar large">
                    {person.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <b>{person.name}</b>
                    <small>
                      {person.role} · MFA{" "}
                      {person.active ? "verified" : "required"}
                    </small>
                  </div>
                  <i className={person.active ? "active" : "suspended"}>
                    {person.active ? "Active" : "Suspended"}
                  </i>
                  <Switch
                    checked={person.active}
                    onCheckedChange={(v) => notify(`${v ? "Restore" : "Suspend"} access request prepared for ${person.name}; independent approval required`)}
                    aria-label={`Request ${person.active ? "suspension" : "restoration"} for ${person.name}`}
                  />
                </article>
              ))}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="roles">
          <section className="control-grid">
            <article className="panel">
              <PanelHead eyebrow="PERMISSION SETS" title="Role-based access" />
              <div className="rule-list">
                {[
                  ["Chief Executive Officer", "Organization-wide authority with separation of duties"],
                  ["General Manager", "Staff lifecycle, responsibilities and delegated approvals"],
                  ["Operations Manager", "Operational staffing, locations and service controls"],
                  ["Finance manager", "Payments, settlement, reports"],
                  ["Operations", "Invoices, customers, support"],
                  ["Viewer", "Read-only records"],
                  ["Custom role", "4 scoped permissions"],
                ].map((r) => (
                  <button
                    key={r[0]}
                    onClick={() => notify(`${r[0]} permissions opened`)}
                  >
                    <ShieldCheck />
                    <span>
                      <b>{r[0]}</b>
                      <small>{r[1]}</small>
                    </span>
                    <ChevronRight />
                  </button>
                ))}
              </div>
            </article>
            <article className="panel">
              <PanelHead
                eyebrow="TRANSACTION POLICY"
                title="Limits and approvals"
              />
              <label>
                Single-officer limit
                <input defaultValue="5,000 USD equivalent" />
              </label>
              <label>
                Daily organization limit
                <input defaultValue="50,000 USD equivalent" />
              </label>
              <label>
                Effective date
                <input type="date" defaultValue="2026-09-21" />
              </label>
              <label>
                Change reason
                <input placeholder="Required for the approval record" />
              </label>
              <div className="toggle-line">
                <span>
                  <b>Maker-checker</b>
                  <small>Required for all outward payments</small>
                </span>
                <Switch defaultChecked />
              </div>
              <div className="toggle-line">
                <span>
                  <b>Transaction signing</b>
                  <small>OTP for high-risk changes</small>
                </span>
                <Switch defaultChecked />
              </div>
              <button
                className="primary-button compact"
                onClick={() => notify("Policy change submitted for independent maker-checker approval")}
              >
                Submit policy change
              </button>
            </article>
          </section>
        </TabsContent>
        <TabsContent value="locations">
          <section className="panel">
            <PanelHead
              eyebrow="BRANCH MANAGEMENT"
              title="Branches, campuses and service locations"
              action="Add location"
              click={() => notify("Location setup opened")}
            />
            <div className="location-grid">
              {[
                ["Head office", "Sinkor, Monrovia", "Primary"],
                [
                  role === "School"
                    ? "Paynesville Campus"
                    : "Broad Street Branch",
                  "Monrovia",
                  "Active",
                ],
                [
                  role === "Prospeva Agent"
                    ? "Red Light cash point"
                    : "Congo Town Office",
                  "Montserrado",
                  "Active",
                ],
              ].map((l) => (
                <article key={l[0]}>
                  <MapPin />
                  <div>
                    <b>{l[0]}</b>
                    <small>{l[1]}</small>
                  </div>
                  <i>{l[2]}</i>
                  <button onClick={() => notify(`${l[0]} opened`)}>
                    <ChevronRight />
                  </button>
                </article>
              ))}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="sessions">
          <section className="panel">
            <PanelHead eyebrow="SECURITY" title="Devices and active sessions" />
            <div className="session-list">
              {[
                [
                  "MacBook Pro · Chrome",
                  "Monrovia · Current session",
                  "Current",
                ],
                ["iPhone 16 · Prospeva", "Monrovia · 8:42 AM", "Trusted"],
                ["Windows PC · Edge", "Paynesville · Yesterday", "Review"],
              ].map((s) => (
                <article key={s[0]}>
                  <Laptop />
                  <div>
                    <b>{s[0]}</b>
                    <small>{s[1]}</small>
                  </div>
                  <i>{s[2]}</i>
                  <button onClick={() => notify(`${s[0]} access revoked`)}>
                    Revoke
                  </button>
                </article>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function Reconciliation({ data, notify }: any) {
  const [resolved, setResolved] = useState<string[]>([]);
  const items = [
    ["RC-1294", "Partner bank", "25,000 USD", "Missing reference"],
    ["RC-1295", "Orange Money", "18,500 LRD", "Amount variance"],
    ["RC-1296", "External card", "85.00 USD", "Settlement delayed"],
  ];
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="RECONCILIATION WORKSPACE"
        title="Match every movement to the ledger"
        copy={`Reconcile ${data.name} across Prospeva, banks, mobile money, cards, PAPSS and Onafriq.`}
        action="Import statement"
        click={() => notify("Statement importer opened")}
      />
      <section className="recon-sources">
        {[
          ["Prospeva ledger", "100%", "18,492"],
          ["Partner bank", "98.7%", "1,242"],
          ["Mobile money", "99.2%", "824"],
          ["Card settlements", "97.8%", "486"],
        ].map((s) => (
          <article key={s[0]}>
            <Database />
            <div>
              <b>{s[0]}</b>
              <small>{s[2]} records</small>
            </div>
            <strong>{s[1]}</strong>
            <span>
              <i style={{ width: s[1] }} />
            </span>
          </article>
        ))}
      </section>
      <article className="panel">
        <PanelHead
          eyebrow="NEEDS REVIEW"
          title="Unmatched and exception items"
        />
        <div className="exception-list">
          {items.map((item) => (
            <article
              key={item[0]}
              className={resolved.includes(item[0]) ? "resolved" : ""}
            >
              <AlertTriangle />
              <div>
                <small>
                  {item[0]} · {item[1]}
                </small>
                <b>{item[3]}</b>
              </div>
              <strong>{item[2]}</strong>
              <i>{resolved.includes(item[0]) ? "Resolved" : "Open"}</i>
              <button
                onClick={() => {
                  setResolved((v) => [...v, item[0]]);
                  notify(`${item[0]} reconciled`);
                }}
                disabled={resolved.includes(item[0])}
              >
                {resolved.includes(item[0]) ? <Check /> : <RefreshCw />}
                {resolved.includes(item[0]) ? "Matched" : "Match"}
              </button>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

function Documents({ role, notify }: any) {
  const docs = [
    ["Business registration", "PDF · 1.2 MB", "Verified Sep 1, 2026"],
    [`${role} operating license`, "PDF · 840 KB", "Expires Dec 31, 2026"],
    ["Settlement account letter", "PDF · 420 KB", "Added Aug 18, 2026"],
    ["Board approval mandate", "PDF · 690 KB", "Signed Aug 10, 2026"],
  ];
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="SECURE DOCUMENT VAULT"
        title="Licenses, contracts and evidence"
        copy="Encrypted organization documents with version history, expiry reminders and permanent access logs."
        action="Upload document"
        click={() => notify("Secure upload opened")}
      />
      <section className="vault-summary">
        <FolderLock />
        <div>
          <small>VAULT STATUS</small>
          <b>All required documents are current</b>
          <p>4 active documents · 0 expiring in 30 days</p>
        </div>
        <ShieldCheck />
      </section>
      <div className="document-grid">
        {docs.map((d, index) => (
          <article key={d[0]}>
            <span>
              <FileCheck2 />
            </span>
            <div>
              <b>{d[0]}</b>
              <small>{d[1]}</small>
              <em>{d[2]}</em>
            </div>
            <i>{index < 2 ? "Verified" : "Active"}</i>
            <button onClick={() => notify(`${d[0]} downloaded`)}>
              <Download />
            </button>
          </article>
        ))}
      </div>
      <section className="panel audit-line">
        <Clock3 />
        <div>
          <b>Document audit trail</b>
          <p>
            Every view, download, replacement and approval is attributed to an
            authorized Prospeva ID.
          </p>
        </div>
        <button onClick={() => notify("Document audit opened")}>
          View audit
        </button>
      </section>
    </section>
  );
}

function DeveloperCenter({ notify }: any) {
  const [live, setLive] = useState(false);
  const [hooks, setHooks] = useState<Record<string, boolean>>({
    payments: true,
    settlements: true,
    refunds: false,
    identity: false,
  });
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="DEVELOPER & INTEGRATION CENTER"
        title="Connect your financial tools"
        copy="Use scoped credentials, signed webhooks and a sandbox before requesting production access."
        action="Read API guide"
        click={() => notify("API guide opened")}
      />
      <section className="developer-hero">
        <Code2 />
        <div>
          <small>ENVIRONMENT</small>
          <h3>{live ? "Production" : "Sandbox"}</h3>
          <p>prospeva_{live ? "live" : "test"}_••••••••••••48</p>
        </div>
        <div className="segmented">
          <button
            className={!live ? "active" : ""}
            onClick={() => setLive(false)}
          >
            Sandbox
          </button>
          <button
            className={live ? "active" : ""}
            onClick={() => notify("Production API access remains disabled until certification")}
            disabled
          >
            Production locked
          </button>
        </div>
        <button onClick={() => notify("API key copied")}>
          <Copy />
          Copy key
        </button>
        <button
          onClick={() => notify("Key rotation request requires approval")}
        >
          <RotateCcw />
          Rotate
        </button>
      </section>
      <section className="control-grid">
        <article className="panel">
          <PanelHead
            eyebrow="WEBHOOKS"
            title="Event delivery"
            action="Add endpoint"
            click={() => notify("Webhook endpoint flow opened")}
          />
          <div className="webhook-list">
            {Object.entries(hooks).map(([name, on]) => (
              <div key={name}>
                <Webhook />
                <span>
                  <b>
                    {name}.
                    {name === "payments"
                      ? "completed"
                      : name === "settlements"
                        ? "posted"
                        : "updated"}
                  </b>
                  <small>https://api.stopshop.lr/prospeva/{name}</small>
                </span>
                <Switch
                  checked={on}
                  onCheckedChange={(v) =>
                    setHooks((s) => ({ ...s, [name]: v }))
                  }
                />
              </div>
            ))}
          </div>
        </article>
        <article className="panel">
          <PanelHead eyebrow="API HEALTH" title="Recent requests" />
          <div className="api-stats">
            <div>
              <small>Success rate</small>
              <b>99.98%</b>
            </div>
            <div>
              <small>Median latency</small>
              <b>184 ms</b>
            </div>
            <div>
              <small>Requests today</small>
              <b>12,842</b>
            </div>
          </div>
          <div className="api-log">
            {[
              ["POST /v1/payments", "201", "182 ms"],
              ["GET /v1/settlements", "200", "94 ms"],
              ["POST /v1/paylinks", "201", "221 ms"],
            ].map((r) => (
              <p key={r[0]}>
                <code>{r[0]}</code>
                <i>{r[1]}</i>
                <span>{r[2]}</span>
              </p>
            ))}
          </div>
          <button
            className="primary-button compact"
            onClick={() => notify("Developer logs exported")}
          >
            Export logs
          </button>
        </article>
      </section>
    </section>
  );
}

function SupportCenter({ data, notify }: any) {
  const [query, setQuery] = useState("");
  const cases = [
    ["CS-3918", "Settlement pending", "Payments", "In progress"],
    ["CS-3912", "Customer receipt correction", "Receipts", "Waiting for you"],
    ["CS-3884", "Bank connection review", "Connections", "Resolved"],
  ];
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="OPERATIONS SUPPORT CONSOLE"
        title="Resolve customer and payment issues"
        copy={`Search any reference for ${data.name}, inspect its timeline and open a case with full transaction context.`}
        action="Open support case"
        click={() => notify("Support case form opened")}
      />
      <section className="support-search">
        <Search />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Transaction, PayLink, invoice, phone or case reference"
        />
        <button
          onClick={() =>
            notify(
              query ? `Searching for ${query}` : "Enter a reference to search",
            )
          }
        >
          Search
        </button>
      </section>
      <section className="support-grid">
        <article className="panel">
          <PanelHead eyebrow="ACTIVE CASES" title="Support queue" />
          <div className="case-list">
            {cases.map((c) => (
              <button
                key={c[0]}
                onClick={() => notify(`${c[0]} timeline opened`)}
              >
                <HelpCircle />
                <div>
                  <small>
                    {c[0]} · {c[2]}
                  </small>
                  <b>{c[1]}</b>
                </div>
                <i>{c[3]}</i>
                <ChevronRight />
              </button>
            ))}
          </div>
        </article>
        <article className="panel">
          <PanelHead eyebrow="SERVICE HEALTH" title="Partner status" />
          <div className="health-list">
            {[
              ["Prospeva shared backend", "Not connected"],
              ["IIPS / NEPS", "Integration pending"],
              ["PAPSS", "Certification required"],
              ["Onafriq card pay-ins", "Certification required"],
              ["Orange Money", "Disabled"],
            ].map((h) => (
              <p key={h[0]}>
                <span>
                  <i className="watch" />
                  {h[0]}
                </span>
                <b>{h[1]}</b>
              </p>
            ))}
          </div>
          <div className="support-callout">
            <Mail />
            <span>
              <b>Escalation desk</b>
              <small>
                Priority support for blocked settlement and customer-impacting
                incidents.
              </small>
            </span>
            <button onClick={() => notify("Escalation requested")}>
              Escalate
            </button>
          </div>
        </article>
      </section>
    </section>
  );
}

function NotificationCenter({ notify }: any) {
  const [unread, setUnread] = useState([0, 1, 2, 3]);
  const notes = [
    [
      "Approval required",
      "Partner bank withdrawal AP-20418 needs your signature.",
      "2 min",
    ],
    [
      "Settlement posted",
      "18,500 LRD reached the approved Orange Money account.",
      "18 min",
    ],
    ["New support reply", "Prospeva Operations updated case CS-3918.", "1 hr"],
    [
      "License reminder",
      "Operating license review is due in 45 days.",
      "Yesterday",
    ],
  ];
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="NOTIFICATION CENTER"
        title="What needs your attention"
        copy="Security, payments, approvals, settlements and service updates in one auditable inbox."
        action="Mark all read"
        click={() => {
          setUnread([]);
          notify("All notifications marked read");
        }}
      />
      <div className="notification-list">
        {notes.map((n, i) => (
          <button
            key={n[0]}
            className={unread.includes(i) ? "unread" : ""}
            onClick={() => {
              setUnread((v) => v.filter((x) => x !== i));
              notify(`${n[0]} opened`);
            }}
          >
            <span>
              {i === 0 ? (
                <ShieldCheck />
              ) : i === 1 ? (
                <Check />
              ) : i === 2 ? (
                <HelpCircle />
              ) : (
                <FileText />
              )}
            </span>
            <div>
              <b>{n[0]}</b>
              <p>{n[1]}</p>
            </div>
            <small>{n[2]}</small>
            <ChevronRight />
          </button>
        ))}
      </div>
      <section className="panel notification-preferences">
        <Bell />
        <div>
          <b>Delivery preferences</b>
          <p>Choose SMS, email, push and in-app alerts by event severity.</p>
        </div>
        <button onClick={() => notify("Notification preferences opened")}>
          Manage
        </button>
      </section>
    </section>
  );
}

function ProspevaAI({
  role,
  data,
  notify,
  setAction,
}: {
  role: Role;
  data: any;
  notify: any;
  setAction: any;
}) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{ question: string; answer: string; evidence: string[]; next: string[] }>>([]);
  const intelligence: Record<Role, { title: string; brief: string; prompts: string[]; skills: string[] }> = {
    Merchant: { title: "Sales, settlement and financing analyst", brief: "Sales are ahead of the recent average. One pay-on-account item, three settlements and one merchant-financing request need review.", prompts: ["Am I ready for merchant financing?", "Why are three settlements still pending?", "Compare this week’s sales with the prior four weeks", "Which customers have unpaid invoices?"], skills: ["Financing readiness", "Settlement review", "Sales patterns", "Customer collections"] },
    Lender: { title: "Portfolio and merchant underwriting analyst", brief: "Assigned merchant sales and settlement evidence is available for review. Two applications require lender-owned underwriting decisions.", prompts: ["Which assigned merchants are financing-ready?", "Which applications need manual review?", "Explain the merchant risk-control signals", "Forecast settlement-linked collections"], skills: ["Merchant underwriting", "Portfolio risk", "Evidence review", "Collections forecast"] },
    Hospital: { title: "Healthcare receivables analyst", brief: "Patient collections are stable. Nine insurance claims and eighteen invoices remain unresolved.", prompts: ["Summarize overdue patient balances", "Which insurance claims need follow-up?", "Review active payment plans"], skills: ["Patient receivables", "Claims follow-up", "Sponsor balances", "Payment plans"] },
    School: { title: "Tuition and campus analyst", brief: "Term collections are at 78%. Forty-two balances require guardian or sponsor follow-up.", prompts: ["Which tuition balances are overdue?", "Compare collections by campus", "Summarize scholarship balances"], skills: ["Tuition aging", "Campus comparison", "Guardian follow-up", "Scholarship review"] },
    "Susu Group": { title: "Contribution cycle analyst", brief: "The current cycle is 92% funded. Two member contributions remain due before payout.", prompts: ["Who has missed this cycle’s contribution?", "Is the next payout fully funded?", "Show the contribution history"], skills: ["Cycle funding", "Member contributions", "Payout readiness", "Approval controls"] },
    "Prospeva Agent": { title: "Liquidity and float analyst", brief: "Cash and electronic float are within the demo thresholds. Five cash reservations await service.", prompts: ["Do I have enough cash for today’s withdrawals?", "Reconcile cash against electronic float", "Explain today’s commissions"], skills: ["Cash liquidity", "Electronic float", "Queue monitoring", "Commission review"] },
    Church: { title: "Giving and fund analyst", brief: "Contributions are on plan. Three pledges and one restricted-fund review need attention.", prompts: ["Which pledges are overdue?", "Summarize restricted ministry funds", "Prepare a donor activity overview"], skills: ["Giving patterns", "Pledge follow-up", "Restricted funds", "Donor statements"] },
    Landlord: { title: "Rent and property analyst", brief: "Rent collection is at 72%. Four overdue rents and six maintenance items need review.", prompts: ["Which tenants are overdue?", "Compare performance by property", "Summarize deposits and maintenance costs"], skills: ["Rent roll", "Arrears review", "Property performance", "Deposit controls"] },
  };
  const profile = intelligence[role];
  const generate = (prompt: string) => {
    const clean = prompt.trim();
    if (!clean) return;
    const subject = clean.toLowerCase();
    let answer = `I reviewed the available demo records for ${data.name}. ${profile.brief}`;
    if (/settle|reconcil|float|cash/.test(subject)) answer = `The demo records show ${data.pending}. The internal Prospeva record is available, but external provider confirmation is unavailable because production integrations are disabled. Review the related exceptions before preparing any adjustment.`;
    else if (/overdue|unpaid|due|missed|arrear/.test(subject)) answer = `${data.pending} is the current attention signal for this ${role.toLowerCase()} workspace. The oldest sample record should be reviewed first, followed by owner assignment and an approved reminder or case workflow.`;
    else if (/financ|merchant|risk|reliab|manual|underwriting/.test(subject)) answer = role === "Merchant"
      ? `The demo evidence shows a medium enterprise, USD 125,420 in verified trailing sales, four branches, 98.7% settlement completion and positive customer-demand movement. This supports lender review—not approval. Confirm consent, requested use, obligations and outstanding risk conditions before an assigned lender decides its own structure and terms.`
      : `The assigned merchant evidence supports lender review, not an automatic credit decision. Verify KYB and owners, merchant consent, sales, branches, settlement history, customer demand, requested product, obligations and risk controls before applying this lender’s product-specific policy.`;
    else if (/compare|pattern|forecast|performance|week|campus|property/.test(subject)) answer = `The demo trend is positive overall, but the result is directional because the shared backend is not connected. The strongest movement comes from completed internal records; pending external activity should be excluded until status is confirmed.`;
    else if (/fee|route|provider|papss|onafriq/.test(subject)) answer = `No production route recommendation can be made yet. PAPSS, Onafriq, bank, mobile-money, and card-provider pricing is not connected or certified. A production answer must cite a quote ID, fee rules, FX version, recipient amount, and settlement estimate.`;
    const evidence = [
      `${data.id} · Active ${role} organization`,
      `${data.records[0][0]} · ${data.records[0][1]} · ${data.records[0][3]}`,
      `COR-DEMO-88421 · Prototype evidence set`,
    ];
    const next = ["Open the related records", "Confirm the assigned owner and SLA", "Prepare a governed review—do not execute automatically"];
    setMessages((current) => [...current, { question: clean, answer, evidence, next }]);
    setQuestion("");
    notify("ProspevaAI analysis generated and audit logged");
  };
  return (
    <section className="workspace-stack prospera-ai-workspace">
      <PageIntro
        eyebrow="PROSPEVAAI"
        title={profile.title}
        copy={`Investigate ${data.name} using evidence from this ${role.toLowerCase()} workspace. ProspevaAI explains and prepares drafts; authorized people remain responsible for every decision.`}
      />
      <section className="ai-control-bar">
        <span><i />Interactive demo engine</span>
        <span><Database />{data.id}</span>
        <span><ShieldCheck />Human approval required</span>
        <span><Clock3 />{messages.length} audit {messages.length === 1 ? "event" : "events"}</span>
      </section>
      <section className="ai-summary ai-summary-active">
        <BrainCircuit />
        <div>
          <small>TODAY’S OPERATIONS BRIEF</small>
          <h3>{data.name}</h3>
          <p>{profile.brief}</p>
        </div>
        <i>Demo records · refreshed now</i>
      </section>
      <section className="ai-cockpit">
        <aside className="panel ai-capabilities">
          <div><small>ACTIVE CAPABILITIES</small><h3>{role} intelligence</h3></div>
          {profile.skills.map((skill, index) => <button key={skill} onClick={() => generate(profile.prompts[index % profile.prompts.length])}><span>{index + 1}</span><b>{skill}</b><ChevronRight /></button>)}
          <div className="ai-scope-note"><LockKeyhole /><span><b>Scope enforced</b><small>Only records authorized for {data.name} are available.</small></span></div>
        </aside>
        <div className="ai-conversation">
          <section className="ai-prompt-row" aria-label="Suggested questions">
            {profile.prompts.map((prompt) => <button key={prompt} onClick={() => generate(prompt)}><Sparkles />{prompt}</button>)}
          </section>
          {messages.length === 0 ? (
            <section className="panel ai-empty-state"><BrainCircuit /><h3>Ask ProspevaAI to investigate</h3><p>Choose a suggested question or enter your own. Answers will identify the demo records used and the next governed review steps.</p></section>
          ) : (
            <section className="ai-thread" aria-live="polite">
              {messages.map((message, index) => <article key={`${message.question}-${index}`}>
                <div className="ai-user-question"><span>KF</span><p>{message.question}</p></div>
                <div className="ai-response">
                  <span><BrainCircuit /></span>
                  <div><small>PROSPEVAAI ANALYSIS</small><p>{message.answer}</p>
                    <details open={index === messages.length - 1}><summary><FileCheck2 />Evidence used ({message.evidence.length})</summary>{message.evidence.map(item => <code key={item}>{item}</code>)}</details>
                    <div className="ai-next-steps"><b>Recommended review steps</b>{message.next.map(step => <span key={step}><Check />{step}</span>)}</div>
                    <footer><em>High confidence · demo records</em><button onClick={() => setAction("ProspevaAI review draft")}>Prepare review draft</button></footer>
                  </div>
                </div>
              </article>)}
            </section>
          )}
        </div>
      </section>
      <section className="ai-ask ai-ask-active">
        <Sparkles />
        <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") generate(question); }} placeholder={`Ask ProspevaAI about ${role.toLowerCase()} operations`} aria-label="Ask ProspevaAI" />
        {messages.length > 0 && <button className="ai-clear" onClick={() => { setMessages([]); notify("ProspevaAI conversation cleared"); }}>Clear</button>}
        <button disabled={!question.trim()} onClick={() => generate(question)}>Analyze <ArrowRight /></button>
      </section>
      <p className="ai-note">
        <ShieldCheck />
        ProspevaAI cannot move money, approve credit or KYC, release holds, change fees or FX, modify permissions, or activate providers. Production answers will cite backend source records and be audit logged.
      </p>
    </section>
  );
}

function PeopleAccounts({
  role,
  data,
  setAction,
}: {
  role: Role;
  data: any;
  setAction: any;
}) {
  const directory: Record<Role, string[][]> = {
    Merchant: [["Kelvin Freeman","Customer","CUS-10482","Verified"],["Martha Kallon","Repeat buyer","CUS-10483","Verified"],["James Doe","Pay-on-account customer","CUS-10484","Review"]],
    Lender: [["Martha Kallon","Borrower","BOR-20482","Active"],["Samuel Toe","Applicant","APP-20483","Review"],["Stop & Shop","Employer relationship","ORG-2081","Verified"]],
    Hospital: [["Kelvin Freeman","Patient","PAT-30482","Active"],["Martha Kallon","Guarantor","GUA-30483","Verified"],["Atlantic Insurance","Payer","PAY-30484","Review"]],
    School: [["Esme Fallah","Student","STU-40482","Active"],["Martha Kallon","Guardian","GRD-40483","Verified"],["Samuel Toe","Sponsor","SPN-40484","Review"]],
    "Susu Group": [["Martha Kallon","Member","MEM-50482","Current"],["James Doe","Member","MEM-50483","Current"],["Hawa Sirleaf","Member","MEM-50484","Due"]],
    "Prospeva Agent": [["Kelvin Freeman","Customer","CUS-60482","Verified"],["Martha Kallon","Cash-out customer","CUS-60483","Verified"],["Red Light Point","Sub-agent location","LOC-60484","Review"]],
    Church: [["Martha Kallon","Member","MEM-70482","Active"],["Anonymous donor","Donor profile","DON-70483","Private"],["Youth Ministry","Ministry fund","FND-70484","Active"]],
    Landlord: [["Martha Kallon","Tenant","TEN-80482","Current"],["Samuel Toe","Tenant","TEN-80483","Due"],["Congo Town House 4","Property","PRP-80484","Active"]],
  };
  const peopleLabel: Record<Role,string> = {Merchant:"Customers",Lender:"Borrowers & applicants",Hospital:"Patients, guarantors & payers",School:"Students, guardians & sponsors","Susu Group":"Members & contributors","Prospeva Agent":"Customers, sub-agents & locations",Church:"Members, donors & ministries",Landlord:"Tenants, occupants & properties"};
  return <section className="workspace-stack">
    <PageIntro eyebrow="ORGANIZATION DIRECTORY" title={peopleLabel[role]} copy={`Records are scoped to ${data.name}. Personal identity and organization membership remain separate.`} action="Add record" click={()=>setAction("Add directory record")}/>
    <section className="record-identity-strip">
      <div><small>ACTIVE ORGANIZATION</small><b>{data.name}</b><em>{data.id}</em></div>
      <div><small>WORKSPACE TYPE</small><b>{role}</b><em>Independent data boundary</em></div>
      <div><small>SHARED RECORD STATUS</small><b>Prototype mapping</b><em>Backend not connected</em></div>
    </section>
    <Tabs defaultValue="directory" className="control-tabs">
      <TabsList className="control-tab-list"><TabsTrigger value="directory">Directory</TabsTrigger><TabsTrigger value="staff">Staff</TabsTrigger><TabsTrigger value="accounts">Wallets & accounts</TabsTrigger><TabsTrigger value="related">Related records</TabsTrigger><TabsTrigger value="audit">Audit</TabsTrigger></TabsList>
      <TabsContent value="directory"><article className="panel records-panel"><div className="panel-head"><div><small>DEMO DIRECTORY</small><h3>{peopleLabel[role]}</h3></div><div className="search-box"><Search/><input aria-label={`Search ${peopleLabel[role]}`} placeholder="Search by name or record ID"/></div></div><div className="directory-list">{directory[role].map(row=><button key={row[2]} onClick={()=>setAction(`${row[0]} 360`)}><span className="avatar large">{row[0].slice(0,2).toUpperCase()}</span><div><b>{row[0]}</b><small>{row[1]}</small></div><code>{row[2]}</code><i>{row[3]}</i><ChevronRight/></button>)}</div></article></TabsContent>
      <TabsContent value="staff"><article className="panel empty-detail"><Users/><h3>Staff memberships</h3><p>Manage staff lifecycle, responsibilities and access from Organization control.</p><button className="primary-button compact" onClick={()=>setAction("Add staff member")}>Add staff member</button></article></TabsContent>
      <TabsContent value="accounts"><article className="panel empty-detail"><WalletCards/><h3>Business wallets and accounts</h3><p>Demo balances are separated by organization, currency and account purpose.</p></article></TabsContent>
      <TabsContent value="related"><article className="panel related-record-grid">{[["Organization record",data.id],["Super Admin mapping",`ADM-${data.id}`],["Membership scope",`MEM-${role.slice(0,3).toUpperCase()}-001`],["Correlation ID","COR-DEMO-88421"]].map(x=><div key={x[0]}><small>{x[0]}</small><b>{x[1]}</b></div>)}</article></TabsContent>
      <TabsContent value="audit"><article className="panel empty-detail"><FileCheck2/><h3>Append-only activity history</h3><p>Directory views, exports and changes will be recorded when the shared backend is connected.</p></article></TabsContent>
    </Tabs>
  </section>;
}

function ReportsCenter({
  role,
  data,
  notify,
  setAction,
}: {
  role: Role;
  data: any;
  notify: any;
  setAction: any;
}) {
  const reportLabels: Record<Role, string[]> = {
    Merchant: ["Sales & refunds", "Settlement summary", "Merchant financing requests", "Fees & contribution", "Customer activity"],
    Lender: ["Merchant financing portfolio", "Portfolio performance", "Repayment collections", "Delinquency", "Employer channels"],
    Hospital: ["Patient collections", "Sponsor balances", "Insurance claims", "Payment plans"],
    School: ["Tuition collection", "Outstanding balances", "Campus performance", "Scholarships"],
    "Susu Group": ["Contribution cycle", "Member position", "Payout history", "Missed contributions"],
    "Prospeva Agent": ["Cash movement", "Electronic float", "Commissions", "Daily reconciliation"],
    Church: ["Offerings & tithes", "Designated funds", "Pledges", "Donor statements"],
    Landlord: ["Rent roll", "Tenant balances", "Property performance", "Deposits & maintenance"],
  };
  const rows = reportLabels[role];
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow={`${role.toUpperCase()} REPORTING`}
        title="Reports, exports and audit evidence"
        copy={`Generate role-specific reports for ${data.name}. Demo reports are clearly separated from future backend records.`}
        action="Create custom report"
        click={() => setAction("Create custom report")}
      />
      <section className="report-overview">
        <article><FileBarChart/><div><small>REPORTS READY</small><b>12</b><em>Demo datasets</em></div></article>
        <article><Clock3/><div><small>SCHEDULED</small><b>4</b><em>Email delivery</em></div></article>
        <article><ShieldCheck/><div><small>AUDIT EXPORTS</small><b>3</b><em>Permission controlled</em></div></article>
        <article><Database/><div><small>DATA SOURCE</small><b>Prototype</b><em>Backend not connected</em></div></article>
      </section>
      <Tabs defaultValue="library" className="control-tabs">
        <TabsList className="control-tab-list">
          <TabsTrigger value="library">Report library</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="exports">Export history</TabsTrigger>
        </TabsList>
        <TabsContent value="library">
          <article className="panel report-library">
            <PanelHead eyebrow="ROLE-SPECIFIC REPORTS" title={`${role} report library`} />
            {rows.map((name, index) => (
              <button key={name} onClick={() => setAction(`${name} report`)}>
                <span><FileBarChart/></span>
                <div><b>{name}</b><small>Updated with demo data · USD and LRD shown separately</small></div>
                <i>{index === 0 ? "Ready" : index === 1 ? "Scheduled" : "Available"}</i>
                <ChevronRight/>
              </button>
            ))}
          </article>
        </TabsContent>
        <TabsContent value="scheduled">
          <article className="panel empty-detail"><Clock3/><h3>Scheduled report delivery</h3><p>Monthly executive, finance and operations reports are prepared for authorized recipients.</p><button className="primary-button compact" onClick={() => setAction("Schedule report")}>Schedule report</button></article>
        </TabsContent>
        <TabsContent value="exports">
          <article className="panel empty-detail"><Download/><h3>Export history</h3><p>Every CSV or PDF export records the user, organization, scope, reason and correlation ID.</p><button className="primary-button compact" onClick={() => notify("Export audit opened")}>View export audit</button></article>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function RoleModulePage({
  role,
  data,
  moduleName,
  navigate,
  notify,
  setAction,
}: {
  role: Role;
  data: any;
  moduleName: string;
  navigate: any;
  notify: any;
  setAction: any;
}) {
  const module = roleWorkspaces[role].find(([name]) => name === moduleName);
  if (!module) {
    return (
      <section className="panel empty-detail">
        <AlertTriangle/>
        <h3>Module unavailable for this workspace</h3>
        <p>Switch back to Overview to open an authorized {role} operation.</p>
        <button className="primary-button compact" onClick={() => navigate("Overview")}>Return to overview</button>
      </section>
    );
  }
  const [name, value, description] = module;
  const relatedRecords = data.records.map((row: string[], index: number) => [
    `${role.slice(0, 3).toUpperCase()}-${String(8421 + index)}`,
    row[0],
    row[1],
    row[2],
    row[3],
  ]);
  return (
    <section className="workspace-stack">
      <button className="module-back" onClick={() => navigate("Overview")}><ChevronRight/>Overview</button>
      <PageIntro
        eyebrow={`${role.toUpperCase()} WORKSPACE`}
        title={name}
        copy={`${description}. Records and permissions are scoped to ${data.name} (${data.id}).`}
        action={`Open ${name.toLowerCase()} workflow`}
        click={() => setAction(name)}
      />
      <section className="module-status-grid">
        <article><Activity/><div><small>CURRENT POSITION</small><b>{value}</b><em>Demo organization data</em></div></article>
        <article><BadgeCheck/><div><small>WORKSPACE</small><b>{role}</b><em>{data.name}</em></div></article>
        <article><ShieldCheck/><div><small>CONTROL</small><b>Role scoped</b><em>Audit logged</em></div></article>
      </section>
      <article className="panel records-panel">
        <div className="panel-head"><div><small>RELATED RECORDS</small><h3>{name} activity</h3></div><button className="secondary" onClick={() => notify(`${name} filters opened`)}><Filter/>Filters</button></div>
        <div className="module-record-list">
          {relatedRecords.map((row: string[]) => (
            <button key={row[0]} onClick={() => setAction(`${row[0]} · ${name}`)}>
              <code>{row[0]}</code><div><b>{row[1]}</b><small>{row[2]}</small></div><strong>{row[3]}</strong><i>{row[4]}</i><ChevronRight/>
            </button>
          ))}
        </div>
      </article>
      <section className="panel module-governance"><ShieldCheck/><div><b>Organization boundary enforced</b><p>This module uses {data.id} as its active scope. Production actions will require the shared backend, permission checks and immutable audit records.</p></div><button onClick={() => notify(`${name} audit opened`)}>View audit</button></section>
    </section>
  );
}

function WorkspacePage({ title, role, data, notify, setAction }: any) {
  const configs: Record<string, any> = {
    "Money & wallets": [
      "DUAL-CURRENCY TREASURY",
      "Wallets and funding",
      "Manage cleared LRD and USD balances, funding sources and reserved money.",
      "Add funds",
      WalletCards,
    ],
    "Payments & collections": [
      "PAYMENT OPERATIONS",
      "Collections and disbursements",
      `Track every ${role.toLowerCase()} payment across wallet, bank, mobile money and cards.`,
      "New payment",
      HandCoins,
    ],
    Settlements: [
      "SETTLEMENT CONTROL",
      "Settlement accounts",
      "Move cleared funds to approved bank and mobile-money destinations.",
      "Settle funds",
      Landmark,
    ],
    "People & accounts": [
      "CONNECTED ACCOUNTS",
      data.peopleLabel,
      "Manage verified identities, balances, references and payment history.",
      "Add account",
      Users,
    ],
    Reports: [
      "FINANCIAL REPORTING",
      "Reports and reconciliation",
      "Download transaction, settlement, fee and audit-ready reports.",
      "Create report",
      FileBarChart,
    ],
    Support: [
      "PROSPEVA SUPPORT",
      "Operations support center",
      "Open and track customer, payment, settlement and connection cases.",
      "Open case",
      HelpCircle,
    ],
  };
  const [eyebrow, heading, copy, action, Icon] =
    configs[title] || configs.Reports;
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow={eyebrow}
        title={heading}
        copy={copy}
        action={action}
        click={() => setAction(action)}
      />
      <section className="workspace-kpis">
        <Metric
          icon={Icon}
          tone="blue"
          label="Available"
          value={data.balance}
          note="Cleared balance"
        />
        <Metric
          icon={Activity}
          tone="green"
          label="This month"
          value="+12.4%"
          note="Compared with last month"
        />
        <Metric
          icon={Clock3}
          tone="orange"
          label="Pending"
          value={data.pending}
          note="Needs review"
        />
      </section>
      <article className="panel records-panel">
        <div className="panel-head">
          <div>
            <small>ORGANIZATION RECORDS</small>
            <h3>Recent {title.toLowerCase()}</h3>
          </div>
          <div className="search-box">
            <Search />
            <input placeholder="Search records" />
          </div>
        </div>
        <RecordsTable
          records={[...data.records, ...data.records]}
          open={setAction}
        />
      </article>
    </section>
  );
}

function TapOnPhone({ data, close, notify }: any) {
  const [step, setStep] = useState<"setup" | "tap" | "complete">("setup");
  const [currency, setCurrency] = useState("LRD");
  const [amount, setAmount] = useState("5,000");
  const [cardSource, setCardSource] = useState("Prospeva digital card");
  const [reference, setReference] = useState("Walk-in sale");
  const numericAmount = Math.max(0, Number(amount.replace(/,/g, "")) || 0);
  const internal = cardSource === "Prospeva digital card";
  const prosperaFee = numericAmount * (internal ? 0.0025 : 0.003);
  const networkFee = numericAmount * (internal ? 0 : 0.025);
  const payerDebit = numericAmount + prosperaFee + networkFee;
  const money = (value: number) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: currency === "USD" ? 2 : 0,
      maximumFractionDigits: 2,
    });
  const referenceCode = "TAP-829174";
  if (step === "complete")
    return (
      <>
        <SheetHeader>
          <SheetTitle>Payment received</SheetTitle>
          <SheetDescription>{data.name} · Tap on Phone</SheetDescription>
        </SheetHeader>
        <div className="tap-flow">
          <div className="tap-success">
            <span>
              <Check />
            </span>
            <small>CONTACTLESS PAYMENT APPROVED</small>
            <h3>
              {money(numericAmount)} {currency}
            </h3>
            <p>Credited to {data.name}</p>
          </div>
          <div className="tap-receipt">
            <ReviewRow label="Reference" value={referenceCode} />
            <ReviewRow label="Payment method" value={cardSource} />
            <ReviewRow
              label="Payment rail"
              value={internal ? "Prospeva internal" : "Onafriq Card Payins"}
            />
            <ReviewRow
              label="Payer debited"
              value={`${money(payerDebit)} ${currency}`}
            />
            <ReviewRow
              label="You received"
              value={`${money(numericAmount)} ${currency}`}
            />
            <ReviewRow
              label="Settlement"
              value={internal ? "Available now" : "1–2 business days"}
            />
          </div>
          <div className="tap-receipt-actions">
            <button onClick={() => notify("Receipt downloaded")}>
              <Download />
              Download receipt
            </button>
            <button onClick={() => notify("Receipt link copied")}>
              <Copy />
              Share receipt
            </button>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              setStep("setup");
              setAmount(currency === "LRD" ? "5,000" : "50.00");
            }}
          >
            Take another payment
          </button>
          <button className="back-button" onClick={close}>
            Done
          </button>
        </div>
      </>
    );
  if (step === "tap")
    return (
      <>
        <SheetHeader>
          <SheetTitle>Ready for contactless payment</SheetTitle>
          <SheetDescription>
            {data.name} · {money(payerDebit)} {currency} total
          </SheetDescription>
        </SheetHeader>
        <div className="tap-flow">
          <div className="tap-live-badge">
            <i />
            SoftPOS session active
          </div>
          <button
            className="tap-target"
            onClick={() => {
              setStep("complete");
              notify("Contactless payment approved");
            }}
            aria-label="Simulate contactless card tap"
          >
            <span className="tap-rings">
              <SmartphoneNfc />
            </span>
            <h3>Tap card or phone here</h3>
            <p>
              The payer can use a physical contactless card or a supported
              digital wallet.
            </p>
            <small>
              Keep the card near this device until confirmation appears.
            </small>
          </button>
          <div className="tap-due">
            <span>
              <small>SALE AMOUNT</small>
              <b>
                {money(numericAmount)} {currency}
              </b>
            </span>
            <span>
              <small>PAYER TOTAL</small>
              <b>
                {money(payerDebit)} {currency}
              </b>
            </span>
          </div>
          <div className="tap-security">
            <ShieldCheck />
            <span>
              <b>No card number is stored</b>
              <small>
                Encrypted contactless authorization · Session expires in 02:00
              </small>
            </span>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              setStep("complete");
              notify("Contactless payment approved");
            }}
          >
            <SmartphoneNfc />
            Simulate card tap
          </button>
          <button className="back-button" onClick={() => setStep("setup")}>
            Cancel and edit payment
          </button>
        </div>
      </>
    );
  return (
    <>
      <SheetHeader>
        <SheetTitle>Tap on Phone</SheetTitle>
        <SheetDescription>{data.name} · Contactless checkout</SheetDescription>
      </SheetHeader>
      <div className="tap-flow">
        <div className="tap-intro">
          <span>
            <SmartphoneNfc />
          </span>
          <div>
            <small>SOFTPOS CHECKOUT</small>
            <h3>Enter the sale, then accept a tap</h3>
            <p>
              Use this device to accept supported physical cards and digital
              wallets—no separate terminal needed.
            </p>
          </div>
        </div>
        <label>
          Receive currency
          <div className="segmented">
            <button
              className={currency === "LRD" ? "active" : ""}
              onClick={() => {
                setCurrency("LRD");
                setAmount("5,000");
              }}
            >
              LRD
            </button>
            <button
              className={currency === "USD" ? "active" : ""}
              onClick={() => {
                setCurrency("USD");
                setAmount("50.00");
              }}
            >
              USD
            </button>
          </div>
        </label>
        <label>
          Amount
          <div className="amount-input">
            <input
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.,]/g, ""))
              }
              inputMode="decimal"
            />
            <span>{currency}</span>
          </div>
        </label>
        <label>
          Sale reference
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Order, invoice or customer note"
          />
        </label>
        <label>
          Demo card presented
          <Select value={cardSource} onValueChange={setCardSource}>
            <SelectTrigger className="field-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Prospeva digital card">
                Prospeva digital card
              </SelectItem>
              <SelectItem value="External contactless card">
                External contactless card
              </SelectItem>
            </SelectContent>
          </Select>
          <small className="field-help">
            In production, the card source is detected automatically after the
            tap.
          </small>
        </label>
        <div className="card-fee-choice">
          <CreditCard />
          <div>
            <b>{cardSource}</b>
            <small>
              {internal
                ? "Lowest-fee Prospeva card route"
                : "External card routed through an acquiring partner"}
            </small>
          </div>
          <i>{internal ? "LOW FEE" : "STANDARD FEE"}</i>
        </div>
        <div className="route-disclosure tap-disclosure">
          <div>
            <Network />
            <span>
              <b>Full payment disclosure</b>
              <small>Review before activating contactless acceptance</small>
            </span>
            <i>READY</i>
          </div>
          {[
            [
              "Payment rail",
              internal ? "Prospeva internal card rail" : "Onafriq Card Payins",
            ],
            ["Exchange rate", "No conversion"],
            ["Prospeva fee", `${money(prosperaFee)} ${currency}`],
            ["Partner / network fee", `${money(networkFee)} ${currency}`],
            ["Total payer debit", `${money(payerDebit)} ${currency}`],
            ["Exact recipient amount", `${money(numericAmount)} ${currency}`],
            ["Settlement estimate", internal ? "Instant" : "1–2 business days"],
          ].map(([key, value]) => (
            <p key={key}>
              <span>{key}</span>
              <b>{value}</b>
            </p>
          ))}
        </div>
        <button
          className="primary-button"
          disabled={numericAmount <= 0 || !reference.trim()}
          onClick={() => setStep("tap")}
        >
          <SmartphoneNfc />
          Activate Tap on Phone
        </button>
        <button className="back-button" onClick={close}>
          Cancel
        </button>
      </div>
    </>
  );
}

function BusinessConnectivity({ isOnline, role, notify }: any) {
  const [queued, setQueued] = useState([
    ["PAY-20491", "Supplier payment", "Waiting for connection"],
    ["REC-88412", "Reconciliation note", "Saved locally"],
  ]);
  return (
    <section className="workspace-stack">
      <PageIntro
        eyebrow="BUSINESS CONTINUITY"
        title="Connectivity & secure synchronization"
        copy="Preview how approved work will be protected during an outage. No money movement is submitted from this prototype."
      />
      <div
        className={`business-network-state ${isOnline ? "online" : "offline"}`}
      >
        <Network />
        <div>
          <small>CURRENT STATUS</small>
          <h3>
            {isOnline ? "Browser connection available" : "Offline prototype mode"}
          </h3>
          <p>
            {isOnline
              ? "Shared Prospeva backend, ledger and provider synchronization are not connected yet."
              : "Prototype drafts remain local. Nothing is marked completed while offline."}
          </p>
        </div>
        <i>{isOnline ? "DEMO" : "OFFLINE"}</i>
      </div>
      <div className="continuity-grid">
        {[
          [
            "Prepare payments",
            "Save drafts with currency, payee and approval context.",
            FileText,
          ],
          [
            "Queue operational records",
            "Preserve original timestamps for approved non-financial records.",
            Clock3,
          ],
          [
            "Agent-assisted support",
            "Locate an agent or call support for approved cash services.",
            Smartphone,
          ],
          [
            "Reconcile after reconnect",
            "Detect duplicates, stale codes and conflicting changes.",
            RefreshCw,
          ],
        ].map(([t, c, I]: any) => (
          <button key={t} onClick={() => notify(`${t} opened for ${role}`)}>
            <I />
            <b>{t}</b>
            <span>{c}</span>
            <ChevronRight />
          </button>
        ))}
      </div>
      <section className="panel continuity-queue">
        <PanelHead eyebrow="DEVICE QUEUE" title="Waiting for synchronization" />
        {queued.map((q, i) => (
          <article key={q[0]}>
            <Clock3 />
            <div>
              <b>{q[1]}</b>
              <small>
                {q[0]} · {q[2]}
              </small>
            </div>
            <i>NOT COMPLETED</i>
            <button
              onClick={() => {
                setQueued((v) => v.filter((_, x) => x !== i));
                notify("Draft removed from queue");
              }}
            >
              Remove
            </button>
          </article>
        ))}
      </section>
      <section className="panel security-panel">
        <ShieldCheck />
        <div>
          <h3>Completion is server-authoritative</h3>
          <p>
            USSD and SMS availability depends on the organization, user
            permission and mobile network. High-risk approvals and bulk releases
            always require an authenticated online session.
          </p>
        </div>
        <button onClick={() => notify("Continuity policy opened")}>
          View policy
        </button>
      </section>
      <section className="ecosystem-standard" aria-label="Prospeva ecosystem standards">
        <div>
          <small>CONNECTED WORKSPACE</small>
          <b>One identity · multiple independent organizations</b>
          <p>The active organization ID scopes every balance, record, permission and audit event.</p>
        </div>
        <div>
          <small>SHARED TRANSACTION STATES</small>
          <b>Draft · Pending approval · Submitted · Processing · Completed · Failed · Reversed</b>
          <p>Settlement and reconciliation appear as separate operational states after completion.</p>
        </div>
        <div>
          <small>BEFORE MONEY MOVES</small>
          <b>Rail · FX rate · Prospeva fee · Partner fee · Total debit · Recipient amount · Settlement estimate</b>
          <p>The same disclosure standard applies across mobile, Business, Employer and Admin review.</p>
        </div>
      </section>
    </section>
  );
}

function ActionPanel({
  action,
  role,
  data,
  close,
  notify,
  isOnline = true,
}: any) {
  const [currency, setCurrency] = useState("LRD");
  const [amount, setAmount] = useState("5,000");
  const [approved, setApproved] = useState(false);
  if (
    action === "Tap on Phone" ||
    (role === "Merchant" && action === "Collect payment")
  )
    return <TapOnPhone data={data} close={close} notify={notify} />;
  const staffActions = ["Add staff member","Add & onboard","Assign responsibility","Promote or transfer","Temporary delegation","Suspend or offboard"];
  if (staffActions.includes(action)) return <>
    <SheetHeader><SheetTitle>{action}</SheetTitle><SheetDescription>{data.name} · {role} · governed staff lifecycle</SheetDescription></SheetHeader>
    <div className="action-content">
      <div className="action-hero"><span><UserPlus/></span><div><small>MAKER-CHECKER WORKFLOW</small><h3>{action}</h3><p>CEO, General Manager or Operations Manager may prepare this request. Sensitive access requires independent approval.</p></div></div>
      <label>Staff member<input placeholder="Name or Prospeva identity" /></label>
      <label>Position<Select defaultValue="Customer Service Representative"><SelectTrigger className="field-select"><SelectValue/></SelectTrigger><SelectContent>{["Customer Service Representative","IT Officer","Cybersecurity Specialist","Marketing Officer","Finance Officer","Branch Manager","Custom position"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></label>
      <label>Responsibility scope<Select defaultValue="Organization"><SelectTrigger className="field-select"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Organization">Entire organization</SelectItem><SelectItem value="Location">Specific location</SelectItem><SelectItem value="Department">Department</SelectItem><SelectItem value="Temporary">Temporary assignment</SelectItem></SelectContent></Select></label>
      <label>Effective date<input type="date" defaultValue="2026-09-21" /></label>
      <label>Reason<input placeholder="Required for the immutable audit record" /></label>
      <aside className="governance-note"><ShieldCheck/><span><b>Separation of duties</b><small>The requester cannot approve their own sensitive role or permission change.</small></span></aside>
      <button className="primary-button" onClick={()=>{notify(`${action} submitted for approval`);close();}}>Submit for approval <ShieldCheck/></button>
      <button className="back-button" onClick={close}>Cancel</button>
    </div>
  </>;
  const merchantFinancingAction = action === "Request merchant financing" || action === "Review financing offer";
  const lenderFinancingAction = action.includes("merchant financing") || action.includes("financing structure") || action.startsWith("Configure ") || action.startsWith("Review merchant application");
  if (merchantFinancingAction || lenderFinancingAction) return <>
    <SheetHeader><SheetTitle>{action}</SheetTitle><SheetDescription>{data.name} · {role} · governed financing workflow</SheetDescription></SheetHeader>
    <div className="action-content financing-action-sheet">
      <div className="action-hero"><span><Landmark/></span><div><small>{role === "Merchant" ? "MERCHANT REQUEST" : "LENDER UNDERWRITING"}</small><h3>{action}</h3><p>{role === "Merchant" ? "Share consented business evidence with the selected assigned lender." : "Prepare lender-owned terms using verified merchant evidence and your institution’s policy."}</p></div></div>
      {role === "Merchant" ? <>
        <label>Assigned lender<Select defaultValue="Unity Bank"><SelectTrigger className="field-select"><SelectValue/></SelectTrigger><SelectContent>{["Unity Bank","Monrovia SME Fund","Commerce Growth Finance"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></label>
        <label>Financing purpose<Select defaultValue="Inventory financing"><SelectTrigger className="field-select"><SelectValue/></SelectTrigger><SelectContent>{["Inventory financing","Working capital","Equipment purchase","Branch expansion","Seasonal demand"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></label>
        <label>Requested amount<div className="amount-input"><input defaultValue="25,000"/><span>USD</span></div></label>
        <label>Use of funds<input placeholder="Products, supplier, equipment or expansion details" /></label>
        <aside className="financing-consent-summary"><FileCheck2/><span><b>Evidence shared with consent</b><small>KYB profile, verified sales, business size, branches, settlement history, customer demand, obligations, product request and risk signals.</small></span></aside>
        <label className="confirm-check"><input type="checkbox" checked={approved} onChange={e=>setApproved(e.target.checked)}/><span><b>I authorize this lender review</b><small>The assigned lender—not Prospeva—sets the structure and makes the credit decision.</small></span></label>
      </> : <>
        <label>Financing structure<Select defaultValue="Revenue-based finance"><SelectTrigger className="field-select"><SelectValue/></SelectTrigger><SelectContent>{["Revenue-based finance","Revolving inventory line","Fixed-term working capital","Equipment finance","Custom lender product"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></label>
        <label>Proposed amount<div className="amount-input"><input defaultValue="25,000"/><span>USD</span></div></label>
        <label>Collection model<Select defaultValue="Settlement share"><SelectTrigger className="field-select"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Settlement share">Percentage of eligible settlements</SelectItem><SelectItem value="Scheduled">Scheduled installments</SelectItem><SelectItem value="Draw cycle">Revolving draw cycle</SelectItem><SelectItem value="Asset linked">Asset-linked schedule</SelectItem></SelectContent></Select></label>
        <label>Conditions<input placeholder="Required documents, covenants or approval conditions" /></label>
        <label>Decision reason<input placeholder="Required for the credit and audit record" /></label>
        <aside className="governance-note"><ShieldCheck/><span><b>Lender-owned decision</b><small>Terms require the lender’s configured approval level. The preparer cannot self-approve when maker-checker applies.</small></span></aside>
        <label className="confirm-check"><input type="checkbox" checked={approved} onChange={e=>setApproved(e.target.checked)}/><span><b>Evidence and disclosures reviewed</b><small>Submit as a versioned draft for independent approval.</small></span></label>
      </>}
      <button className="primary-button" disabled={!approved} onClick={()=>{notify(`${action} submitted to the governed financing workflow`);close();}}>{role === "Merchant" ? "Submit request" : "Submit financing draft"}<ShieldCheck/></button>
      <button className="back-button" onClick={close}>Cancel</button>
    </div>
  </>;
  return (
    <>
      <SheetHeader>
        <SheetTitle>{action}</SheetTitle>
        <SheetDescription>
          {data.name} · {role}
        </SheetDescription>
      </SheetHeader>
      <div className="action-content">
        <div className="action-hero">
          <span>
            <Sparkles />
          </span>
          <div>
            <small>SECURE WORKFLOW</small>
            <h3>{action}</h3>
            <p>
              All activity is permission-controlled and recorded in the
              organization audit log.
            </p>
          </div>
        </div>
        <label>
          Currency
          <div className="segmented">
            <button
              className={currency === "LRD" ? "active" : ""}
              onClick={() => setCurrency("LRD")}
            >
              LRD
            </button>
            <button
              className={currency === "USD" ? "active" : ""}
              onClick={() => setCurrency("USD")}
            >
              USD
            </button>
          </div>
        </label>
        <label>
          Amount
          <div className="amount-input">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} />
            <span>{currency}</span>
          </div>
        </label>
        <label>
          From
          <Select defaultValue="Organization wallet">
            <SelectTrigger className="field-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Organization wallet">
                Organization wallet
              </SelectItem>
              <SelectItem value="Partner bank">Partner bank</SelectItem>
              <SelectItem value="Mobile money">
                Mobile money settlement
              </SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label>
          Reference
          <input placeholder="Invoice, account or internal note" />
        </label>
        <div className="route-disclosure">
          <div>
            <Network />
            <span>
              <b>Route quote preview</b>
              <small>Illustrative only · providers disabled</small>
            </span>
            <i>DEMO</i>
          </div>
          {[
            ["Payment rail", "Not selected"],
            ["Exchange rate", "No conversion"],
            ["Prospeva fee", `Demo estimate`],
            ["Partner fee", `Unavailable`],
            ["Recipient receives", `${amount} ${currency}`],
            ["Settlement", "Unavailable until certification"],
          ].map(([key, value]) => (
            <p key={key}>
              <span>{key}</span>
              <b>{value}</b>
            </p>
          ))}
        </div>
        <label className="confirm-check">
          <input
            type="checkbox"
            checked={approved}
            onChange={(e) => setApproved(e.target.checked)}
          />
          <span>
            <b>I reviewed the details</b>
            <small>Submit this instruction for maker-checker approval.</small>
          </span>
        </label>
        <button
          className="primary-button"
          disabled={!approved}
          onClick={() => {
            notify(`${action} submitted for approval`);
            close();
          }}
        >
          Submit securely <ShieldCheck />
        </button>
        <button className="back-button" onClick={close}>
          Cancel
        </button>
      </div>
    </>
  );
}
