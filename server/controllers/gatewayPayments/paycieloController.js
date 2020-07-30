//CIELO GATEWAY
const BodyParser = require("body-parser");
const Express = require("express");
const axios = require("axios");
var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//MODELS DB
const User = require("../../models/mongo/userModel");
const Cielo = require("../../models/mongo/cielo/cieloModel");

//ENV KEYS 
// const Token = process.env.GETNETTOKENS;


exports.cieloPayment = async (req, res, next) => {
    const { CardNumber, Holder, ExpirationDate, SecurityCode } = req.body;

  //GETNET URL
  const url_mode = process.env.URLCIELO;
  //var url = "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/";

  var url = url_mode+"/1/sales/";

  var data = {
    MerchantOrderId: "2014111703",
    Customer: {
      Name: "Comprador crédito simples"
    },
    Payment: {
      Type: "CreditCard",
      Amount: 15700,
      Installments: 1,
      SoftDescriptor: "123456789ABCD",
      CreditCard: {
        CardNumber: CardNumber,
        Holder: Holder,
        ExpirationDate: ExpirationDate,     // ex: 12/2030
        SecurityCode: SecurityCode,
        Brand: "Visa",
        CardOnFile: {
          Usage: "Used",
          Reason: "Unscheduled"
        }
      },
      IsCryptoCurrencyNegotiation: true
    }
  };

  const newPayment = new Cielo({
    CardNumber,
    Holder,
    ExpirationDate,
    SecurityCode,
  });

  newPayment.save();          //save data in cielos model mongodb


  axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
        //"Accept": "application/x-www-form-urlencoded",

        MerchantId: "b17ac0ba-ff14-408a-93d7-dbcba07363b0",
        MerchantKey: "XKSPPVZAZGAXATFPYBLNLKDHMLDMUENYIYJJXJUC"

        //  "MerchantId": process.env.MERCHANTID,
        //  "MerchantKey": process.env.MERCHANTKEY
      }
    })
    .then(data => {
      //console.log("data", data);
      //return res.json(data.data);
      return res.json(data.data.Payment.ReturnMessage);
    })

    .catch(e => {
      console.log("error", e);
      return res.json(e);
    });
};



/*

Cielo doc: https://developercielo.github.io/manual/cielo-ecommerce

SANDBOX
Requisições	     https://apisandbox.cieloecommerce.cielo.com.br
Consultas	     https://apiquerysandbox.cieloecommerce.cielo.com.br


PRODUÇÃO
Requisições		https://api.cieloecommerce.cielo.com.br/
Consultas		https://apiquery.cieloecommerce.cielo.com.br/


SANDBOX KEYS
MerchantId: "b17ac0ba-ff14-408a-93d7-dbcba07363b0"
MerchantKey: "XKSPPVZAZGAXATFPYBLNLKDHMLDMUENYIYJJXJUC"

Json body data exemple:

{
   "MerchantOrderId":"2014111703",
   "Customer":{
      "Name":"Comprador crédito simples"
   },
   "Payment":{
     "Type":"CreditCard",
     "Amount":15700,
     "Installments":1,
     "SoftDescriptor":"123456789ABCD",
     "CreditCard":{
         "CardNumber":"1234123412341231",
         "Holder":"Teste Holder",
         "ExpirationDate":"12/2030",
         "SecurityCode":"123",
         "Brand":"Visa",
         "CardOnFile":{
            "Usage": "Used",
            "Reason":"Unscheduled"
         }
     },
     "IsCryptoCurrencyNegotiation": true
   }
}



*/
