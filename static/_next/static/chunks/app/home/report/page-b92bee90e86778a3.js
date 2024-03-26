(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[828],{23769:function(e,t,a){"use strict";a.d(t,{Dx:function(){return o.Z},Zb:function(){return n.Z},zx:function(){return r.Z}});var r=a(6020),n=a(392),o=a(82630)},19781:function(e,t,a){Promise.resolve().then(a.bind(a,22434))},22434:function(e,t,a){"use strict";a.r(t);var r=a(57437),n=a(43204),o=a(86248),c=a(13664),l=a(4202),i=a(10349),s=a(23769),d=a(62074),D=a.n(d),u=a(2265),m=a(96769),f=a(27431);t.default=()=>{let e=(0,l.T)(),[t,a]=(0,u.useState)(""),[d,g]=(0,u.useState)(""),[x,p]=(0,u.useState)(void 0),{refetch:v}=(0,i.ed)(void 0,{refetchOnMountOrArgChange:!0}),{refetch:Q,data:h}=(0,i.dz)({machineId:x||0,startTime:t,endTime:d},{skip:void 0===x,refetchOnMountOrArgChange:!0}),getAllRecordQuerryConfig=async()=>{try{let t=await v().unwrap(),n=(null==t?void 0:t.map(e=>({label:e.systemID,value:e.id})))||[],l=(0,r.jsx)(f.yEd,{className:"mt-1 mr-5 text-3xl text-green-500"});return{icon:l,title:"Load Records",sucessMessage:"Done",errorMessage:"Fail",submitBtnColor:"blue",onSubmit:async t=>{let{formData:n}=t;try{let{machineId:e}=n;p(e),a(()=>{var e;if(!(null===(e=n.timeRange)||void 0===e?void 0:e.from))return;let t=new Date(n.timeRange.from);return t.setHours(0,0,0,0),t.toISOString()}),g(()=>{var e;if(!(null===(e=n.timeRange)||void 0===e?void 0:e.to))return;let t=new Date(n.timeRange.to);return t.setHours(23,59,59,999),t.toISOString()}),await Q().unwrap()}catch(a){let t={type:"error",title:"Get Record Error",message:"Error Loading Record",data:JSON.stringify(a,null,2)};e((0,c.cf)((0,r.jsx)(o.Z,{...t})))}},fields:[{type:"select",title:"Machine",require:!0,key:"machineId",options:n},{type:"dateRangePicker",title:"Time Range",require:!1,key:"timeRange"}]}}catch(e){throw e}},y=[{name:"Module Serial No.",selector:e=>e.moduleSerialNo},{name:"PLC Date Time",selector:e=>e.systemDt},{name:"Created At",selector:e=>{let t=new Date(e.createdAt);return t.toString()},sortable:!0,customSort:(e,t,a)=>[...e].sort((e,r)=>{let n=t(e),o=t(r);return"string"==typeof n?"desc"===a?o.localeCompare(n):n.localeCompare(o):"number"==typeof n?"desc"===a?o-n:n-o:n instanceof Date?"desc"===a?o.getTime()-n.getTime():n.getTime()-o.getTime():"desc"===a?o.toString().localeCompare(n.toString()):n.toString().localeCompare(o.toString())})},{name:"Good/NG",selector:e=>e.result,cell:e=>{var t,a;return(0,r.jsx)("div",{className:"text-center py-2 px-4 rounded ".concat(1===e.result?"bg-green-500 text-white":2===e.result?"bg-red-500 text-white":"bg-yellow-500 text-white"),children:(null===(t=e.result)||void 0===t?void 0:t.toString())==="1"?"Good":(null===(a=e.result)||void 0===a?void 0:a.toString())==="2"?"NG":"Unknown"})}}],onSearchClickHandler=async()=>{let t=await getAllRecordQuerryConfig();e((0,c.cf)((0,r.jsx)(n.Z,{...t})))},dataToCsv=e=>{let t="data:text/csv;charset=utf-8,";return t+="Module Serial No,System Date,Result,Created At,OPID,CurDta_QD01,CurDta_QD02,CurDta_QD03,CurDta_QD04,PrvDta1_QD01,PrvDta1_QD02,PrvDta1_QD03,PrvDta1_QD04,PrvDta2_QD01,PrvDta2_QD02,PrvDta2_QD03,PrvDta2_QD04,Try Count,RT,OType,QD01 Min,QD01 Max,QD02 Min,QD02 Max,QD03 Min,QD03 Max,QD04 Min,QD04 Max,Operator Name,OP Text\r\n",e.forEach(e=>{e.recordDatas.forEach(a=>{let r="".concat(e.moduleSerialNo,",").concat(e.systemDt,",").concat(e.result,",").concat(e.createdAt,",").concat(a.OPID,",").concat(a.CurDta_QD01,",").concat(a.CurDta_QD02,",").concat(a.CurDta_QD03,",").concat(a.CurDta_QD04,",").concat(a.PrvDta1_QD01,",").concat(a.PrvDta1_QD02,",").concat(a.PrvDta1_QD03,",").concat(a.PrvDta1_QD04,",").concat(a.PrvDta2_QD01,",").concat(a.PrvDta2_QD02,",").concat(a.PrvDta2_QD03,",").concat(a.PrvDta2_QD04,",").concat(a.TryCnt,",").concat(a.RT,",").concat(a.OType,",").concat(a.QD01_Min,",").concat(a.QD01_Max,",").concat(a.QD02_Min,",").concat(a.QD02_Max,",").concat(a.QD03_Min,",").concat(a.QD03_Max,",").concat(a.QD04_Min,",").concat(a.QD04_Max,",").concat(a.OperatorName.replace(/,/g,";"),",").concat(a.OPTxt.replace(/,/g,";"));t+=r+"\r\n"})}),t},generateXmlForRecord=e=>{let{recordDatas:t,systemDt:a,moduleSerialNo:r}=e,{systemID:n,lineID:o,stationID:c,stationName:l}=e.machine,i={lineInfo:{SystemID:n,SystemDT:a,ModuleSerialNo:r},stationInfo:{LineID:o,StationName:l,StationID:c,PartID:"0",Mode:"0"}},s="".concat(l,"_").concat(r,"_").concat(a,".xml"),d="<Data\n";return d+=formatDataForXml("QD.HDR",i.lineInfo)+"\n"+formatDataForXml("QD.HDR",i.stationInfo)+' DBType="QUALITY"\n',t.forEach(async(e,t)=>{d+=formatDataForXml("QD.DT0".concat(t+1),e)+"\n"}),{fileName:s,xmlData:d+="/>"}},downloadXmlAsZip=async e=>{let t=new(D()),a=document.createElement("a");e.forEach(e=>{let{fileName:a,xmlData:r}=generateXmlForRecord(e);t.file(a,r)});let r=await t.generateAsync({type:"blob"}),n=new Date().toLocaleDateString("en-US",{year:"numeric",month:"2-digit",day:"numeric"}),o=window.URL.createObjectURL(r),c="".concat(n.replace(/[-:]/g,""),".zip");a.href=o,a.download=c,document.body.appendChild(a),a.click(),window.URL.revokeObjectURL(o),a.remove()},formatDataForXml=(e,t)=>Object.entries(t).map(t=>{let[a,r]=t;return"".concat(e,".").concat(a.replace("_","."),'="').concat(r,'"')}).join(" "),downloadCSV=e=>{let t=document.createElement("a"),a=dataToCsv(e),r=new Date().toLocaleDateString("en-US",{year:"numeric",month:"2-digit",day:"numeric"}),n="".concat(r.replace(/[-:]/g,""),".csv");a.match(/^data:text\/csv/i)||(a="data:text/csv;charset=utf-8,".concat(a)),t.setAttribute("href",encodeURI(a)),t.setAttribute("download",n),t.click()};return(0,r.jsxs)(s.Zb,{className:"flex flex-col w-full my-4",children:[(0,r.jsxs)("div",{className:"flex flex-row justify-between w-full",children:[(0,r.jsx)("div",{className:"flex items-center",children:(0,r.jsx)(s.Dx,{children:"Record Table"})}),(0,r.jsxs)("div",{className:"flex items-center",children:[(0,r.jsx)(s.zx,{className:"mr-5",onClick:e=>onSearchClickHandler(),children:"search"}),(0,r.jsx)(s.zx,{className:"mr-5",onClick:e=>downloadCSV(h||[]),children:"Export CSV"}),(0,r.jsx)(s.zx,{className:"mr-5",onClick:e=>downloadXmlAsZip(h||[]),children:"Export Xml"})]})]}),(0,r.jsx)(m.ZP,{className:"font-semibold",columns:y,data:h||[],pagination:!0,onRowClicked:t=>{e((0,c.cf)((0,r.jsx)(o.Z,{type:"info",title:"Record data",data:JSON.stringify(t.recordDatas,null,2),message:"Record Of Module Serial No".concat(t.moduleSerialNo," ")})))},customStyles:{rows:{style:{"&:hover":{backgroundColor:"#f7fafc"}}}},paginationPerPage:10,paginationRowsPerPageOptions:[10,25,50,100],paginationComponentOptions:{rowsPerPageText:"Rows per page:",rangeSeparatorText:"of"}})]})}}},function(e){e.O(0,[982,792,254,543,286,826,20,74,507,971,472,744],function(){return e(e.s=19781)}),_N_E=e.O()}]);