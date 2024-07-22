import { useState } from "react";
import QRScanner from "./QrScanner";
import { useStores } from "../store/index";

const QRScannerPage = () => {
  const [data, setData] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [aadharData, setAadharData] = useState(null);
  const [isFetching, SetIsFetching] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [err, setErr] = useState();
  const { CommonStore } = useStores();

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-API-KEY", "3646f320-aee6-452f-96f8-23718f3000b6");

  const raw = JSON.stringify({
    encodedQR:
      "45346173294701856621508357115875016996092154422620473850395751031636377664070371767153667559507290989362392597909742488021744560537140198988571390517483204970022978204678573159972062619670493099442211047936513290696260910464117411279359230451982179367582828113707392634508799062437973453657987501462802295506102255930101807258317205563598331513248345673466049422434163497809270983096912864520340242230596212746614788791243851316094737062122753657866735784326075702825584655821696533331623564387006719947383080098590414152401199620476291121231114734056854085109778080423153085924263168899096612824290161740263682946826963626779932073954269243292368781404508434126194085407371415763121750354348009990285239361524349823380031432012494484527555922086888298399426077642334270602481618383177024795208626883010905269694507679941335365027646014473555472100154824057623789278245665192255962538675386368947176958381310827570620555098031493668280585394366180841014504062431079252282672283904107242364279364969500697633754949019987072340525785322177319567072753591113534643082554012922921262495583419483290648024558799366909314294251599550971380647386747621639936201762753424713388112878104162314401629446011910254319438660151824278609595637448451255723462254744769635441477748191870417951869524877639730173874588118366855655099903083194917279942097566949142937837365731069272159320052913571843590287999484771176623207304052889807717037317826280170553880476847535799413211871467025348429723219213699385672678935235403810588849046673467234971299408389292286097425019245183364493678077939552458729300197559310340281682074171812832124268207244314602609995689224084161568104754841574443443328019985924463960522657131682276525439556030201996780932531564459577537473900985646878952168600592819158484623619428492989275948360440324829945873917056460510432625848597983590394264937638591420446051558509767936579967800721096618129355180845927825412840044544701526406462503925840942432763848790329084019167504701081822577927901879102846094861164537338985918690017206986791011514362901215346690878728840347788163414335461856377814071073936265856913151177747207194585022530179004956271552130818863858198870157679178261213233718534596874035037896252341896126276954997126257409252406710159060447835510418641146337436357390214187220716063223952637420622155285643848110791492755269596875455773807251393043973393737887712273467526188028646857118828083171975479992090881969446645542844414580864398546257188042908322598777895432687431561156883207087197796843688811439596469172057213641010480404032949207816703394200424891928045715714543495333177679088887309810892907747874379223783022288583426431326930776202815820814595042635464935301358887983629082584083894999410575218267176483239668714404741861747880652792611356384590620236587731795826876840370002384064357582333153644961761970578683676983223326601286961486708233280360268828233173834233181877387860972392065448498578405977384314088148725216404894793393606892633775577314474147116607352281009975476802093056",
  });

  console.log(CommonStore.sessionId);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    // redirect: "follow",
  };

  const decodeData = async (decodedText) => {
    try {
      SetIsFetching(true);
      setFetched(true);
      const response = await fetch(
        `https://ssiapi-staging.smartfalcon.io/aadhaar/verification/${CommonStore.sessionId}`,
        requestOptions
      );

      SetIsFetching(false);
      setFetched(false);

      if (response.ok) {
        // Equivalent to checking response.status === 200
        const result = await response.json();
        console.log(result);
        // setAadharData(result.result);
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      setErr(err);
    }
  };

  const handleScanSuccess = (decodedText, decodedResult) => {
    console.log(`QR Code decoded: ${decodedText}`, decodedResult);
    setData(decodedText);
    // decodeData(decodedText);
    // // Parse the scanned data (assuming XML format for Aadhar QR codes)
    // const parser = new DOMParser();
    // const xmlDoc = parser.parseFromString(decodedText, "text/xml");
    // const aadharData = {
    //   uid: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("referenceid"),
    //   name: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("name"),
    //   gender: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("gender"),
    //   yob: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("dob"),
    //   co: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("careof"),
    //   loc: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("location"),
    //   vtc: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("vtc"),
    //   po: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("postoffice"),
    //   dist: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("district"),
    //   state: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("state"),
    //   pc: xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0].getAttribute("pc")
    // };

    // setParsedData(aadharData);
  };

  const handleScanError = (error) => {
    console.error("Error scanning QR code:", error);
    // Handle the error
  };

  return (
    <div>
      {/* {isFetching && <div className="loading">Loading...</div>} */}
      {/* {fetched && (
        <p
          style={{
            color: "red",
            position: "absolute",
            top: "30%",
            zIndex: "999",
          }}>
          fetched
        </p>
      )} */}
      <QRScanner
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
      />
      {/* <button onClick={decodeData}>click</button> */}
      {data && <p>Scanned data: {data}</p>}
      <p>{err && err.message}</p>
      {parsedData && (
        <div>
          <h2>Parsed Aadhar Data</h2>
          <p>UID: {parsedData.uid}</p>
          <p>Name: {parsedData.name}</p>
          <p>Gender: {parsedData.gender}</p>
          <p>Year of Birth: {parsedData.yob}</p>
          <p>Care of: {parsedData.co}</p>
          <p>Location: {parsedData.loc}</p>
          <p>Village/Town/City: {parsedData.vtc}</p>
          <p>Post Office: {parsedData.po}</p>
          <p>District: {parsedData.dist}</p>
          <p>State: {parsedData.state}</p>
          <p>Postal Code: {parsedData.pc}</p>
        </div>
      )}
      {aadharData && <div>{aadharData?.name}</div>}
    </div>
  );
};

export default QRScannerPage;
