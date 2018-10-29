let configUrl = {
  wxid:"ax1111111",
  url:"www.sap-unis.com"
}
//
let app = getApp();
app.privateData.configUrl = configUrl;
//工作类型
const WORK_TYPE = {
  WORK_JY: "A01",
  WORK_TS: "A02",
  WORK_YY: "A03",
  WORK_HD: "A04",
  WORK_DQ: "A05"
}
export {WORK_TYPE}