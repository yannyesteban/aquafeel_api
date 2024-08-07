const Credit = require("../models/credit");
const PDFDocument = require("pdfkit");

let userTimeZone = "America/Caracas";

module.exports.list = async (req, res, next) => {

	console.log("credit list")
	try {

		
		await Credit.deleteMany({})
			.then(() => {
				console.log('Todos los usuarios han sido eliminados');
			})
			.catch(err => {
				console.error(err);
			});
		

		const {
			field,
			fromDate,
			toDate,
			status_id,
			limit = 1000,
			offset = 0,
			search_key,
			search_value,
			quickDate,
			orderBy = null,
		} = req.query;

		let cond = {
			createdBy: req.query.user_id
		};

		
		
		const count = await Credit.count(cond);
		let orders = await Credit.find(cond)
			.limit(parseInt(limit))
			.skip(parseInt(offset))
			.sort({ created_on: -1, _id: -1 })
			.lean();

		;
		//.populate("status_id");



		/*
		orders = orders.map((order) => {
			order.zip = "45600"
	
			let value = ""
			if (order.buyer1 && order.buyer1.signature) {
				
				value = order.buyer1.signature.toString("base64");
				console.log(value)
			}
			order.buyer1.signature = value//order.buyer1.signature.toString("base64");
			
			if (order.buyer1 && order.buyer1.signature) {
					order.order.buyer1.signature = order.buyer1.signature.toString("base64");
			}
			if (order.buyer2 && order.buyer2.signature) {
			  order.buyer2.signature = order.buyer2.signature.toString("base64");
			} else {
				order.buyer2.signature = "..";
			}
			if (order.employee && order.employee.signature) {
			  order.employee.signature = order.employee.signature.toString("base64");
			}
			if (order.approvedBy && order.approvedBy.signature) {
			  order.approvedBy.signature = order.approvedBy.signature.toString("base64");
			}
			return order;
		  });
	*/
		
console.log({
	//data: orders.map((o)=>{return {id:o.id, buyer1:o.buyer1, system1:o.system1, price: o.price}; }),
	data: orders,
	count,
})
		res.status(200).json({
			//data: orders.map((o)=>{return {id:o.id, buyer1:o.buyer1, system1:o.system1, price: o.price}; }),
			data: orders,
			count,
		});
	} catch (error) {
		console.log(error)
		res.status(400).send({ message: error.message });
	}
};

module.exports.details = async (req, res, next) => {

	
	try {

		let condition = {};
		if (req.query.leadId ) {
			condition = { lead: req.query.leadId};
		} else  {
			condition = { _id: req.query.id };
		}
		
		let order = await Credit.findOne(condition).lean();

		res.status(200).json({
			data: order,
			message: "record recovery correctly!",
		});
	} catch (e) {
		
		res.status(400).json(e);
	}
};

module.exports.add = async (req, res) => {

	console.log("hello add", req.body)

	try {
		const orderData = req.body;
		orderData._id = undefined;

		/*
		orderData.applicant.signature = Buffer.from(
			orderData.applicant.signature,
			"base64"
		);
		orderData.applicant.signature = Buffer.from(
			orderData.applicant.signature,
			"base64"
		);

		orderData.employee.signature = Buffer.from(
			orderData.employee.signature,
			"base64"
		);
		orderData.approvedBy.signature = Buffer.from(
			orderData.approvedBy.signature,
			"base64"
		);

		*/


		console.log(orderData.applicant.signature)
		

		orderData.applicant.signature = Buffer.from(
			orderData.applicant.signature,
			"base64"
		);

		orderData.applicant2.signature = Buffer.from(
			orderData.applicant2.signature,
			"base64"
		);


		orderData.employee.signature = Buffer.from(
			orderData.employee.signature,
			"base64"
		);

		

		orderData.createdOn = Date.now();
		orderData.updatedOn = Date.now();
		//orderData.createdBy = req.body.user_id || "xxxx";

		/*if (orderData.system1){
							orderData.system1._id = undefined
						}
						if (orderData.system2){
							orderData.system2._id = undefined
						}
				
						if (orderData.buyer1){
							orderData.buyer1._id = undefined
						}
				
						if (orderData.buyer2){
							orderData.buyer2._id = undefined
						}
						console.log(orderData);
						orderData.installation._id = undefined
						orderData.price._id = undefined
						orderData.price.terms._id = undefined
						*/
		const newOrder = new Credit(orderData);
		await newOrder.save();

		/*
		newOrder.buyer1.signature = newOrder.buyer1.signature.toString("base64");
		newOrder.buyer2.signature = newOrder.buyer2.signature.toString("base64");
		newOrder.employee.signature = newOrder.employee.signature.toString("base64");
		newOrder.approvedBy.signature = newOrder.approvedBy.signature.toString("base64");

		*/
		let order = await Credit.findOne({_id: newOrder._id}).lean();
		

		res
			.status(201)
			.send({ data: order, message: "record added correctly!" });
	} catch (error) {
		console.log(error)
		res.status(400).send({ message: error.message });
	}
};

module.exports.edit = async (req, res, next) => {
	try {
		const orderData = req.body;

		
		const id = orderData._id;


		orderData.applicant.signature = Buffer.from(
			orderData.applicant.signature,
			"base64"
		);

		orderData.applicant2.signature = Buffer.from(
			orderData.applicant2.signature,
			"base64"
		);


		orderData.employee.signature = Buffer.from(
			orderData.employee.signature,
			"base64"
		);


		
		//orderData._id = undefined

		/*
		orderData.buyer1.signature = Buffer.from(
			orderData.buyer1.signature,
			"base64"
		);
		orderData.buyer2.signature = Buffer.from(
			orderData.buyer2.signature,
			"base64"
		);

		orderData.employee.signature = Buffer.from(
			orderData.employee.signature,
			"base64"
		);
		orderData.approvedBy.signature = Buffer.from(
			orderData.approvedBy.signature,
			"base64"
		);

		*/
		//orderData.createdOn = Date.now(),
		orderData.updatedOn = Date.now();
		
		

		let order = await Credit.findByIdAndUpdate(
			id,
			{
				$set: orderData,
			},
			{ new: true }
		).lean();

		
		res.status(201).json({ data: order, message: "Order updated correctly!" });
	} catch (e) {
		
		res.status(400).json(e);
	}
};

module.exports.delete = async (req, res, next) => {
	let id = req.query.id;
	let deletedOrder = await Credit.deleteOne({ _id: id });

	if (deletedOrder.deletedCount > 0) {
		
		res.status(200).json({
			data: deletedOrder,
			message: "Order deleted successfully",
		});
	} else {
		
		res.status(404).json({
			message: "no Order found",
			data: {},
		});
	}
};

module.exports.pdf1 = async (req, res, next) => {
	try {
		let id = req.query.id;
		//let id = "667c62fa99db989127642954";
		let order = await Credit.findOne({ _id: id });

		// Crear una nueva instancia de PDFDocument
		const doc = new PDFDocument();

		// Configurar el encabezado de respuesta para enviar un PDF
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", "attachment; filename=order.pdf");

		// Pipe del PDF a la respuesta HTTP
		doc.pipe(res);

		// Agregar contenido al PDF
		doc.fontSize(25).text("Detalles de la Orden", { align: "center" });

		// Agregar detalles de la orden
		doc.moveDown();
		doc.fontSize(fontSize2).text(`ID de la Orden: ${order._id}`);
		doc.text(`Cliente: ${order.city}`);
		doc.text(`Total: $${order.city}`);
		doc.text(`Fecha: ${order.city}`);

		// Agregar una línea
		doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).stroke();

		// Finalizar el documento
		doc.end();
	} catch (e) {
		
		res.status(400).json(e);
	}
};

module.exports.pdf = async (req, res, next) => {




	const text = {

		title: "CREDIT APLICATION / APLICACION DE CREDITO",
		subtitle1: "Applicant",
		subtitle2: "Co Applicant",
		subtitle3: "MORTGAGE INFORMATION / INFORMACION SOBRE SU CASA",
		subtitle4: "INCOME INFO / INFORMACIÓN DE INGRESOS",

		subtitle5: "INCOME INFO / INFORMACIÓN DE INGRESOS",
		subtitle6: "PERSONAL REFERENCES / REFERENCIAS PERSONALES",
		subtitle7: "INCOME INFO / INFORMACIÓN DE INGRESOS",
		subtitle8: "Alimony or child support or separate maintenance payments are optional information and need not be revealed if you do not choose to rely on such income in applying for credit. / La pensión alimenticia o la manutención de menores son información opcional y no necesitan ser reveladas si usted no desea que se tengan en cuenta esos ingresos en la solicitud de crédito.",
		subtitle9: "INCOME INFO / INFORMACIÓN DE INGRESOS",
		subtitle10: "INCOME INFO / INFORMACIÓN DE INGRESOS",
		subtitle11: "By eletronic signing below, you certify that any information in the application is true and complete. You authorize us to confirm this information in this application and to give out information about you or your account to credit report agencies and others who are allowed to received it. You authorize and instruct us to request and receive credit information about you from any credit report agency third party. / al firmar eletronicamente , usted certifica que toda la informacion em la solicitude es verdadeira y completa. Usted nos autoriza a confirmar la informacion em esta solicitude y dar a conocer informacion sobre usted o su cuenta a las agencias de reporte de credito y otras personas a quienes se permite recibirlo. Usted nos autoriza y da instruciones de solicitar y recibir informacion de credito acerca de usted de qualquer agencia de credito",
		subtitle12: "230 Capcom Ave Ste. 103, Wake Forest NC 27587 - Ph (919) 790-5475 - Fax (919) 790-5476 \nwww.aquafeelmaryland.com - www.aquafeelvirginia.com - info@aquafeelsolutions.com",




	};

	const AquafeelSolutions =
		"Aquafeel Solutions propone proveer todos los produtos, materiales y mano de obra para instalar lo especificado a continuacion y el comprador(es) ordena y compra los produtos, materiales y mano de obra e instalacion de lo especificado a continuacion:";

	const THIS_CONTRACT_IS =
		"THIS CONTRACT IS VALID ONLY UPON SIGNED APROVAL BY EMPLOYED MANAGEMENT PRESONNEL OF AQUAFEEL SOLUTIONS. SEE TERMS AND CONDITIONS ON REVERSE SIDE. A RESTOCKING FEE OF 20%. WILL BE CHARGE FOR TRANSACTIONS THAT ARE CANCELLED AFTER THREE DAY WATING PERIOD.";
	const TEXT_230_Capcom =
		"230 Capcom Ave Ste. 103, Wake Forest NC 27587 - Ph (919) 790-5475 - Fax (919) 790-5476 \nwww.aquafeelmaryland.com - info@aquafeelvirginia.com";

	const UPON_SIGNING =
		"Upon signing, you acknowledge you agree to the terms and conditions of this contract. You agreed to all payments and charges and to the sales price appearing bellow.";
	const DO_NOT_SIGNED =
		"DO NOT SIGNED THIS CONTRACT UNTILL YOU HAVE READ IT ALL OF THE BLANK SPACES ARE COMPLETED. YOU HAVE THE RIGHT TO RECEIVE A COMPLETE COPY OF THIS CONTRACT. YOU HAVE THE RIGHT TO PREPAY FULL AMOUNT AT ANY TIME AND TO BE NOTIFIED OF THE FULL AMOUNT DUE.";
	const termsAndConditions = `OTHER TERMS AND CONDITIONS
STATE LAW REQUIRES THAT ANYONE WHO CONTRACTS TO DO CONSTRUCTION WORK TO BE LICENSED BY THE CONTRACTORS STATE LICENSE BOARD IN THE LICENSE CATEGORY IN WHICH THE CONTRACTOR IS GOING TO BE WORKING- IF THE TOTAL PRICE OF THE JOB IS $500 OR MORE (INCLUDING LABOR AND MATERIALS). LICENSED CONTRACTORS ARE REGULATED BY LAWS DESIGNED TO PROTECT THE PUBLIC. IF YOU CONTRACT WITH SOMEONE WHO DOES NOT HAVE A LICENSE, THE CONTRACTORS STATE LICENSE BOARD MAY BE UNABLE TO ASSIST YOU WITH A COMPLAINT. YOUR ONLY REMEDY AGAINST UNLICENSED CONTRACTOR MAY BE IN CIVIL COURT AND YOU MAY BE LIABLE FOR DAMAGES ARISING OUT OF ANY INJURIES TO THE CONTRACTOR OR HIS OR HER EMPLOYEES. YOU MAY CONTACT THE CONTRACTORS STATE LICENSE BOARD TO FIND OUT IF THIS CONTRACTOR HAS A VALID LICENSE. THE BOARD HAS COMPLETE INFORMATION ON THE HISTORY OF LICENSED CONTRACTORS, INCLUDING ANY POSSIBLE SUSPENSIONS, REVOCATIONS, JUDGMENTS, AND CITATIONS. SEARCH IN THE WHITE PAGES FOR CONTRACTORS STATE LICENSE BOARD OFFICE NEAREST TO YOU.
1. The tittle to the equipment and materials covered in this Contract shall remain the legal property of Aquafeel Solutions, until the equipment and materials are paid in full. You acknowledge that you are giving a security interest in the goods purchased. The Buyer(s) hereby agrees that there is no written agreement or verbal understanding of any kind or nature, with Aquafeel Solutions, or any of its representatives, whereby this Contract, or any part of it is be altered, modified, or varied in any manner whatsoever from the conditions herein. The terms and conditions of this Contract are complete and exclusive statement of the agreements between the parties, constitute the entire agreement, and supersede and cancel all prior or contemporaneous negotiations, statements, and representations. There are no representations, inducements, promises, or agreements, oral or otherwise, with reference to this sale other than expressly set forth herein. If it is not in writing, and approved by employed management personnel at Aquafeel Solutions, it will not be honored.
I have received a copy of this document:
Buyer’s Signature: _________________________ Buyer’s Signature: ____________________________
2. Aquafeel Solutions, agrees to start and diligently pursue work through to completion, but shall not be responsible for delays for any of the following reasons: Funding of loans, acts of neglect or omissions of the Buyer(s) or the Buyer(s) agent, acts of God, stormy or inclement weather, extra work ordered by the Buyer(s), acts of Public Enemy, riots or civil commotion, failure of Buyer(s) to make your payment(s) when due, or for acts of independent contractors, or Holidays, or other causes beyond Aquafeel Solutions' control. Buyer(s) shall grant free access to work areas for workers, equipment, and vehicles. Aquafeel Solutions' workers shall not be responsible for keeping gates closed for animals and children.
3. This contract shall be construed in accordance with and governed by the laws of the State in which this Contract is signed. If any provision(s) of this contract shall be invalid for any reason, such invalidity shall be confined to the requirements of applicable law and shall not affect the remainder hereof, which shall continue in full force and effect or constitute a binding agreement between parties.
4. In the even a dispute relating to this Contract resulted in litigation between the parties, concerning the work hereunder or any event related thereto, the party prevailing in such dispute shall be entitled to reasonable attorney's fees and cost.
5. All work will be done according to the approved standards in the industry. This does not included correction of defects in existing plumbing or other inadequate building conditions.
6. Financing terms are subject to approval and verification by the financing institution. You hereby authorize the seller to obtain a credit report for the purpose of financing this Contract. Additional financing terms and truth-in-lending information will be provided by the finance company. In the event Buyer(s) is denied credit financing Contracts, upon demand, from any other financing institutions, companies, corporations, or banks, including but not limited to Security Agreements, Lien Contracts, or Assignments of Rent Contracts, repayments period, amount financed, and the APR (interest rate) are subject to change due to varying terms and conditions from secondary financing sources.
7. Additional terms and conditions may be stated on a separate Addendum to Contract. If an Addendum is executed by the Buyer, it shall be incorporated herein and become a part of this Proposal-Work Order-Contract.
NOTICE OF CANCELLATION
Date of Transaction: ___/___/___ Cancellation Date: ___/___/___ (No later than midnight of this date)
You, the Buyer(s), may cancel this transaction, without penalty or obligation, at any time prior to midnight of the third business day after the date of this transaction noted above (i.e., within three business days from the above date). If you cancel, any property traded in, any payments made by you will under the contract sale, and any negotiable instrument executed by you will be returned within 10 days following receipt by the seller of you cancellation notice, and any security interest arising out of the transaction will be cancelled. If you cancel, you must make available to the seller at your residence, in substantially as good condition as when received. If you fail to make the goods available to the seller, or if you agree to return the goods to the seller and fail to do so, then you remain liable for performance of all obligations under the Contract. If you do make the goods available to the seller and they are not picked up within 20 days following the date of this Notice of Cancellation, you may retain or dispose of the goods without any further obligation. To cancel this transaction, mail (if mailed, the copy should be post marked by the third day after the date of the transaction) or deliver a signed and dated copy of this Cancellation Notice or any other written notice, or send a telegram to:
Aquafeel Solutions
230 Capcom Ave Ste. 103, Wake Forest NC 27587 PH (919) 790-5475 • FAX (919) 790-5476
I hereby cancel this transaction:
Date:___/___/___ Buyer’sSignature:________________________ Date:___/___/___ Buyer’sSignature:________________________`;

	const fontSize = 16;
	const fontTitle = 9;
	const bodyWidth = 585;
	const cellFontSize = 8;
	const noteFontSize = 7;
	const startX = 15;
	const startY = 25;

	const rowHeight = 22;

	
	try {
		
		let id = req.query.id;
		userTimeZone = req.query.userTimeZone || userTimeZone;
		let credit = await Credit.findOne({ _id: id }).populate("createdBy");

		
		if (!credit) {
			return res.status(404).json({ message: "Order not found" });
		}



		const doc = new PDFDocument({ size: "LETTER", autoFirstPage: false });

		doc.addPage({
			margins: {
				top: 0,
				bottom: 0,
				left: 72,
				right: 72,
			},
		});

		res.setHeader("Content-Type", "application/pdf");
		doc.pipe(res);

		doc.font("Times-Roman");


		doc.moveDown();
		doc.moveDown();
		doc.fontSize(cellFontSize).text("", startX, startY + rowHeight * 3);
		doc.fontSize(cellFontSize).text(text.title, {
			width: 585,
			align: "center",
		});


		

		//doc.image('uploads/Aquafeel-Blue-Logo.png', 0, 15, {width: 250})
		// .text('Proportional to width', 0, 0);

		doc.image("uploads/Aquafeel-Blue-Logo.png", 15, 25, {
			fit: [bodyWidth, 50],
			align: "center",
			valign: "center",
		});
		doc.moveDown();
		doc.fontSize(cellFontSize).text("", startX, rowHeight * 4);

		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					[
						text.subtitle1,
						text.subtitle2,
						
					]
				],
			},
			startX,
			startY + rowHeight * 4,
			[292, 293],
			rowHeight
		);
		

		doc.fontSize(fontSize).text("", startX, rowHeight);
		const data = {
			//headers: [],
			rows: [
				[
					`BUYER 1: ${credit.applicant.firstName}`,
					`PHONE 1: ${credit.applicant.phone}`,
					`CEL: ${credit.applicant.cel}`,
				],
				[
					`BUYER 2: ${credit.applicant2.firstName}`,
					`PHONE 2: ${credit.applicant2.phone}`,
					`CEL: ${credit.applicant2.cel}`,
				],
			],
		
		
		};

		
		

		doc.fontSize(cellFontSize);
		
		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`Last name\n  ${credit.applicant.lastName}`,
						`First Name\n  ${credit.applicant.firstName}`,
						`Last name\n  ${credit.applicant2.lastName}`,
						`First Name\n  ${credit.applicant2.lastName}`
					],
					[
						`SS#\n  ${credit.applicant.ss}`,
						`Date of Birth\n  ${localDate(credit.applicant.dateOfBirth)}`,
						`SS#\n  ${credit.applicant2.ss}`,
						`Date of Birth\n  ${localDate(credit.applicant2.dateOfBirth)}`,
					],
					[
						`DL#\n  ${credit.applicant.id}`,
						`Exp\n  ${localDate(credit.applicant.idExp)}`,
						`DL#\n  ${credit.applicant2.id}`,
						`Exp\n  ${localDate(credit.applicant2.idExp)}`,
					],
					[
						`Cell Phone\n  ${credit.applicant.cel}`,
						`Home Phone\n  ${credit.applicant.phone}`,
						`Cell Phone\n  ${credit.applicant2.cel}`,
						`Home Phone\n  ${credit.applicant2.phone}`,
					],
				],
			},
			startX,
			startY + rowHeight * 5,
			[146, 146, 146, 147],
			rowHeight
		);


		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`Address\n  ${credit.applicant.address}`,
						`Address\n  ${credit.applicant2.address}`,
						
					],
				],
			},
			startX,
			startY + rowHeight * 9,
			[292, 293],
			rowHeight
		);

		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`City\n  ${credit.applicant.city}`,
						`State\n  ${credit.applicant.state}`,
						`Zip\n  ${credit.applicant.zip}`,

						`City\n  ${credit.applicant2.city}`,
						`State\n  ${credit.applicant2.state}`,
						`Zip\n  ${credit.applicant2.zip}`,
						
					],
				],
			},
			startX,
			startY + rowHeight * 10,
			[97, 97, 98, 97, 97, 99],
			rowHeight
		);


		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`Email\n  ${credit.applicant.email}`,
						`Relationship\n  ${credit.applicant.relationship}`,

						`Email\n  ${credit.applicant2.email}`,
						`Relationship\n  ${credit.applicant2.relationship}`,
						
					],
				],
			},
			startX,
			startY + rowHeight * 11,
			[166, 126, 166, 127],
			rowHeight
		);


		drawTab(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						text.subtitle3,
						
						
					],
				],
			},
			startX,
			startY + rowHeight * 12,
			[bodyWidth],
			rowHeight
		);

		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`Status\n  ${credit.mortgage.status}`,
						`mortgage Company\n  ${credit.mortgage.mortgageCompany}`,

						`Monthly Payment\n  ${credit.mortgage.monthlyPayment}`,
						`How Long Here\n  ${credit.mortgage.howlong}`,
						
					],
				],
			},
			startX,
			startY + rowHeight * 13,
			[166, 126, 166, 127],
			rowHeight
		);

		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						text.subtitle5,
						text.subtitle5,
						
					],
				],
			},
			startX,
			startY + rowHeight * 14,
			[166+ 126, 166 + 127],
			rowHeight
		);


		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`Employer\n  ${credit.applicant.income.employer}`,
						`Years\n  ${credit.applicant.income.years}`,
						`Salary\n  ${credit.applicant.income.salary}`,
						
						`Employer\n  ${credit.applicant2.income.employer}`,
						`Years\n  ${credit.applicant2.income.years}`,
						`Salary\n  ${credit.applicant2.income.salary}`,
						
					],
				],
			},
			startX,
			startY + rowHeight * 15,
			[117, 87, 88, 117, 87, 89],
			rowHeight
		);


		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`Position\n  ${credit.applicant.income.position}`,
						`Business Phone\n  ${credit.applicant.income.phone}`,
						
						
						`Position\n  ${credit.applicant2.income.position}`,
						`Business Phone\n  ${credit.applicant2.income.phone}`,
						
					],
				],
			},
			startX,
			startY + rowHeight * 16,
			[166, 126, 166, 127],
			rowHeight
		);


		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`PREVIOUS EMPLOYER (IF ABOVE LESS THAN 3 YEARS) \n  ${credit.applicant.income.preEmployer}`,
						`PREVIOUS EMPLOYER (IF ABOVE LESS THAN 3 YEARS)\n  ${credit.applicant2.income.preEmployer}`,
						
					],
				],
			},
			startX,
			startY + rowHeight * 17,
			[292, 293],
			rowHeight
		);

		/*
		drawTab(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						text.subtitle8,
						
						
					],
				],
			},
			startX,
			startY + rowHeight * 18,
			[bodyWidth],
			rowHeight
		);
		*/

		doc.fontSize(cellFontSize).text("", startX, startY + rowHeight * 18.1);
		doc.fontSize(noteFontSize).text(text.subtitle8, {
			width: 585,
			align: "left",
		});


		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`SOURCE OF OTHER INCOME / ORIGEN DE OTRO INGRESO \n  ${credit.applicant.income.otherIncome}`,
						`SOURCE OF OTHER INCOME / ORIGEN DE OTRO INGRESO\n  ${credit.applicant2.income.otherIncome}`,
						
					],
				],
			},
			startX,
			startY + rowHeight * 19,
			[292, 293],
			rowHeight
		);

		drawTab(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						text.subtitle6,
						
						
					],
				],
			},
			startX,
			startY + rowHeight * 20,
			[bodyWidth],
			rowHeight
		);

		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`Name \n  ${credit.reference.name}`,
						`Relationship\n  ${credit.reference.relationship}`,
						`Phone\n  ${credit.reference.phone}`,
						
					],
					[
						`Name \n  ${credit.reference2.name}`,
						`Relationship\n  ${credit.reference2.relationship}`,
						`Phone\n  ${credit.reference2.phone}`,
						
					],
				],
			},
			startX,
			startY + rowHeight * 21,
			[195, 195, 195],
			rowHeight
		);

		drawTable(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`Bank Name \n  ${credit.bank.name}`,
						`Account Number\n  ${credit.bank.accountNumber}`,
						`Routing Number\n  ${credit.bank.routingNumber}`,
						`Checking: ${credit.bank.checking ? "Yes" : "No"}\nSaving: ${credit.bank.saving ? "Yes" : "No"}`
						
					]
				],
			},
			startX,
			startY + rowHeight * 23,
			[195, 195, 125, 70],
			rowHeight
		);


		doc.fontSize(cellFontSize).text("", startX, startY + rowHeight * 24.1);
		doc.fontSize(noteFontSize).text(text.subtitle11, {
			width: 585,
			align: "left",
		});


		let sign01 = ( credit.applicant.signature.length > 0) ? { content: credit.applicant.signature } : "( no signature )";
		let sign02 = ( credit.applicant2.signature.length > 0) ? { content: credit.applicant2.signature } : "( no signature )";
		let sign03 = ( credit.employee.signature.length > 0) ? { content: credit.employee.signature } : "( no signature )";

		drawTab(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						sign01, "\n\n  " + localDate(credit.applicant.date), sign02, "\n\n  " + localDate(credit.applicant2.date)
						
						
					],
					[
						"________________________\nSignature / Firma",
						"_________________\nDate / Fecha",
						"________________________\nSignature / Firma",
						"_________________\nDate / Fecha"
						
						
					],
				],
			},
			startX + 20,
			startY + rowHeight * 27,
			[146, 146, 146, 147],
			rowHeight
		);

		drawTab(
			doc,
			{
				//headers: [],
				rows: [
					
					[
						`\n\n${(credit.createdBy?.firstName || "") + (" " + credit.createdBy?.lastName || "") }` ,
						sign03,
						
					],
					[
						`________________________\nREP. DE AQUAFEEL SOLUTIONS` ,
						"________________________\nSignature / Firma",
						
					],
				],
			},
			startX + 20,
			startY + rowHeight * 30,
			[292, 293],
			rowHeight
		);


		doc.fontSize(cellFontSize).text("", startX, startY + rowHeight * 33);
		doc.fontSize(noteFontSize).text(text.subtitle12, {
			width: 585,
			align: "center",
		});

		doc.end();

		return;

		
		const data7 = {
			//headers: [],
			rows: [
				[
					`ADDRESS: ${credit.address}`,
					`CITY: ${credit.city}`,
					`STATE: ${credit.state}`,
					`ZIP: ${credit.zip}`,
				],
			],
		};

		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data7,
			startX,
			startY + rowHeight * 6,
			[275, 110, 110, 90],
			rowHeight
		);

		doc.fontSize(noteFontSize).text("", startX, startY + rowHeight * 7.1);
		//doc.fontSize(noteFontSize).text(text1, startX, startY + rowHeight * 7.1);
		doc.fontSize(noteFontSize).text(AquafeelSolutions, {
			width: 585,
			align: "left",
		});

		const data2 = {
			//headers: [],
			rows: [
				[
					`Name: ${credit.system1.name}`,
					`Brand: ${credit.system1.brand}`,
					`Model: ${credit.system1.model}`,
				],
				[
					`Name: ${credit.system2.name}`,
					`Brand: ${credit.system2.brand}`,
					`Model: ${credit.system2.model}`,
				],
				//[`Other \n  ${order.promotion}`, ``, ``],
			],
		};

		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data2,
			startX,
			startY + rowHeight * 8,
			[195, 195, 195],
			rowHeight
		);

		const data9 = {
			//headers: [],
			rows: [[`Other / Promotion: ${credit.promotion}`]],
		};

		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data9,
			startX,
			startY + rowHeight * 10,
			[bodyWidth],
			rowHeight
		);

		//doc.moveDown();
		//doc.fontSize(cellFontSize).text(text1, { align: "center" });

		doc.fontSize(cellFontSize).text("", startX, startY + rowHeight * 12);
		doc.fontSize(fontTitle).text("INSTALLATION INSTRUCTIONS", {
			width: 585,
			align: "center",
		});
		

		
		const data3 = {
			//headers: ['A', 'B', 'C', "D"],
			rows: [
				[
					`DAY OF INTALLATION: ${credit.installation.day}`,
					`DATE: ${credit.installation.date.toLocaleDateString('en-US')}`,
					`CONEXION ICE MAKER: ${credit.installation.iceMaker ? "Yes" : "No"}`,
					`TIME: ${credit.installation.date.toLocaleTimeString('en-US')}`,
				],
			],
		};
		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data3,
			startX,
			startY + rowHeight * 13,
			[146, 146, 146, 146],
			rowHeight
		);

		const data31 = {
			//headers: ['A', 'B', 'C', "D"],
			rows: [
				[
					`People involved: ${credit.people}`,
					`Floor Type: ${credit.floorType}`,
				],
			],
		};
		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data31,
			startX,
			startY + rowHeight * 14,
			[292, 292],
			rowHeight
		);

		//doc.lineJoin("miter").rect(5, 10, 5, 5).stroke();

		doc.fontSize(fontTitle).text("", startX, rowHeight * 17);
		doc.fontSize(fontTitle).text("Terms or Payment Methods".toUpperCase(), {
			width: 585,
			align: "center",
		});

		const data21 = {
			//headers: [],
			rows: [
				[
					`CREDIT CARD (SIGNED ATTACHED FORM): ${credit.creditCard ? "Yes" : "No"
					}`,
					`CHECK (PAYABLE TO AQUAFEEL SOLUTIONS): ${credit.check ? "Yes" : "No"
					}`,
				],
			],
		};

		doc.moveDown();
		doc.moveDown();
		doc.moveDown();
		doc.moveDown();
		doc.fontSize(noteFontSize).text("\n" + UPON_SIGNING, {
			width: bodyWidth,
			align: "justified",
		});

		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data21,
			startX,
			startY + rowHeight * 17,
			[294, 293],
			rowHeight
		);

		// Sección: Información de Precios
		const data4 = {
			headers: [
				"Cash Price",
				"Installation",
				"Taxes",
				"Total Cash Sales Price",
				"Total Downpayment",
				"Total Cash Price",
			],
			rows: [
				[
					credit.price.cashPrice,
					credit.price.installation,
					credit.price.taxes,
					credit.price.totalCash,
					credit.price.downPayment,
					credit.price.totalCashPrice,
				],
			],
		};
		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data4,
			startX,
			startY + rowHeight * 20,
			[100, 85, 80, 100, 100, 120],
			rowHeight,
			"center"
		);

		const data5 = {
			headers: [
				"Amount to Finance",
				"Payment Terms",
				"A.P.R",
				"Finance Charge",
				"Total of Payments",
			],
			rows: [
				[
					credit.price.toFinance,
					`${credit.price.terms.amount} ${credit.price.terms.unit}`,
					credit.price.APR,
					credit.price.finaceCharge,
					credit.price.totalPayments,
				],
			],
		};
		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data5,
			startX,
			startY + rowHeight * 23,
			[105, 120, 120, 120, 120],
			rowHeight,
			"center"
		);

		doc.fontSize(cellFontSize).text("", startX, rowHeight * 27);
		doc.fontSize(noteFontSize).text(DO_NOT_SIGNED.toUpperCase(), {
			width: 585,
			align: "left",
		});

		let sign1 = ( credit.buyer1.signature.length > 0) ? { content: credit.buyer1.signature } : "( no signature )";
		let sign2 = ( credit.buyer2.signature.length > 0) ? { content: credit.buyer2.signature } : "( no signature )";
		let sign3 = ( credit.employee.signature.length > 0) ? { content: credit.employee.signature } : "( no signature )";
		let sign4 = ( credit.approvedBy.signature.length > 0) ? { content: credit.approvedBy.signature } : "( no signature )";

		const data6 = {
			//headers: ['Amount to Finance', 'Payment Terms', 'A.P.R', "Finance Charge", "Total of Payments"],
			rows: [
				[
					"APROVAL / BUYER 1",
					sign1,
					"DATE",
					`${credit.buyer1.date.toLocaleDateString('en-US')}`,
				],
				[
					"APROVAL / BUYER 2",
					sign2,
					"DATE",
					`${credit.buyer2.date.toLocaleDateString('en-US')}`,
				],
				[
					`${(credit.createdBy?.firstName || "") + (" " + credit.createdBy?.lastName || "") }\nREP. DE AQUAFEEL SOLUTIONS` ,
					sign3,
					"",//"APROB. OF CENTRAL",
					"",//sign4,
				],
			],
		};
		doc.fontSize(cellFontSize);
		drawTab(
			doc,
			data6,
			startX,
			startY + rowHeight * 28 - 15,
			[106, 186, 166, 126],
			rowHeight * 1.5
		);

		doc.fontSize(cellFontSize).text("\n", startX, startY + rowHeight * 31.5);
		doc.fontSize(noteFontSize).text(THIS_CONTRACT_IS + "\n", {
			width: bodyWidth,
			align: "justify",
		});
		doc.fontSize(noteFontSize).text("\n" + TEXT_230_Capcom, {
			width: bodyWidth,
			align: "center",
		});

		doc.addPage({
			margins: {
				top: 72,
				bottom: 0,
				left: 72,
				right: 72,
			},
		});

		

		doc.fontSize(8).text(termsAndConditions);

		doc.end();
	} catch (e) {
		console.log(e)
		res.status(400).json(e);
	}
};

function drawTab(doc, data, startX, startY, columnWidths, rowHeight) {
	let x = startX;
	let y = startY;

	// Determinar el número de columnas basado en la primera fila de datos
	const numColumns = data.headers ? data.headers.length : data.rows[0].length;

	// Dibujar encabezados y líneas horizontales (si hay encabezados)
	if (data.headers && data.headers.length > 0) {
		data.headers.forEach((header, i) => {
			doc.text(header, x + 5, y + 5, {
				width: columnWidths[i] - 10,
				align: "left",
			});
			x += columnWidths[i];
		});

		// Avanzar la posición vertical para las filas
		y += rowHeight;
	}

	// Dibujar filas y líneas horizontales
	data.rows.forEach((row) => {
		x = startX;
		row.forEach((cell, i) => {
			if (typeof cell === 'string' || typeof cell === 'number') {

				if(typeof cell === 'string'){
					cell = cell.toUpperCase();
				} 

				doc.text(cell, x + 5, y + 5, {
					width: columnWidths[i] - 10,
					align: 'left',
				});
			} else {

				
				const imgBase64 = cell.content.toString('base64');
				
				const imgDataUrl = `data:image/png;base64,${imgBase64}`;
				doc.image(imgDataUrl, x + 15, y + 15 - 20 + 7, {
					fit: [columnWidths[i] - 1, rowHeight - 1 + 10],
					align: 'left',
					valign: 'bottom',
				});
			}


			/*
		doc.text(cell, x + 5, y + 5, {
		  width: columnWidths[i] - 10,
		  align: "left",
		});
		*/
			x += columnWidths[i];
		});

		y += rowHeight;
	});

	// Dibujar líneas verticales
	x = startX;
	for (let i = 0; i <= numColumns; i++) {
		if (i < numColumns) {
			x += columnWidths[i];
		}
	}
}

function drawTable(
	doc,
	data,
	startX,
	startY,
	columnWidths,
	rowHeight,
	align = "left",
	lineWidth = 0.1
) {
	doc.lineWidth(lineWidth);

	let x = startX;
	let y = startY;

	// Determinar el número de columnas basado en la primera fila de datos
	const numColumns = data.headers ? data.headers.length : data.rows[0].length;

	doc
		.moveTo(startX, startY)
		.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), startY)
		.stroke();

	// Dibujar encabezados y líneas horizontales (si hay encabezados)
	if (data.headers && data.headers.length > 0) {
		data.headers.forEach((header, i) => {
			doc.text(header, x + 5, y + 5, {
				width: columnWidths[i] - 10,
				align: align,
			});
			x += columnWidths[i];
		});

		// Dibujar la línea inferior del encabezado
		doc
			.moveTo(startX, y + rowHeight)
			.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight)
			.stroke();

		// Avanzar la posición vertical para las filas
		y += rowHeight;
	}

	// Dibujar filas y líneas horizontales
	data.rows.forEach((row) => {
		x = startX;
		row.forEach((cell, i) => {
			if(typeof cell === 'string'){
				cell = cell.toUpperCase();
			} 
			doc.text(cell, x + 5, y + 5, {
				width: columnWidths[i] - 10,
				align: align,
			});
			x += columnWidths[i];
		});

		// Dibujar la línea inferior de cada fila

		doc
			.moveTo(startX, y + rowHeight)
			.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight)
			.stroke(0.5);

		y += rowHeight;
	});

	// Dibujar líneas verticales
	x = startX;
	for (let i = 0; i <= numColumns; i++) {
		doc
			.moveTo(x, startY)
			.lineTo(
				x,
				startY + rowHeight * (data.rows.length + (data.headers ? 1 : 0))
			)
			.stroke();
		if (i < numColumns) {
			x += columnWidths[i];
		}
	}
}

function drawTable0(doc, data, startX, startY, columnWidths, rowHeight) {
	let x = startX;
	let y = startY;

	// Dibujar encabezados y líneas horizontales
	data.headers.forEach((header, i) => {
		doc.text(header, x + 5, y + 5, {
			width: columnWidths[i] - 10,
			align: "left",
		});
		x += columnWidths[i];
	});

	// Dibujar la línea inferior del encabezado
	doc
		.moveTo(startX, y + 0)
		.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y + 0)
		.stroke();

	doc
		.moveTo(startX, y + rowHeight)
		.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight)
		.stroke();

	// Dibujar filas y líneas horizontales
	y += rowHeight;
	data.rows.forEach((row) => {
		x = startX;
		row.forEach((cell, i) => {
			doc.text(cell, x + 5, y + 5, {
				width: columnWidths[i] - 10,
				align: "left",
			});
			x += columnWidths[i];
		});

		// Dibujar la línea inferior de cada fila
		doc
			.moveTo(startX, y + rowHeight)
			.lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight)
			.stroke();

		y += rowHeight;
	});

	// Dibujar líneas verticales
	x = startX;
	for (let i = 0; i <= data.headers.length; i++) {
		doc
			.moveTo(x, startY)
			.lineTo(x, startY + rowHeight * (data.rows.length + 1))
			.stroke();
		if (i < data.headers.length) {
			x += columnWidths[i];
		}
	}
}

function drawTable1(doc, data, startX, startY, columnWidths, rowHeight) {
	let x = startX;
	let y = startY;

	// Dibujar encabezados
	data.headers.forEach((header, i) => {
		doc.text(header, x, y);
		x += columnWidths[i];
	});

	// Dibujar filas
	y += rowHeight;
	data.rows.forEach((row) => {
		x = startX;
		row.forEach((cell, i) => {
			doc.text(cell, x, y);
			x += columnWidths[i];
		});
		y += rowHeight;
	});
}

function localDate( date) {
	if(!date){
		return "";
	}

	// Convertir la fecha de nacimiento a la zona horaria del usuario
	const dateUTC = new Date(date);
	const dateInUserTZ = new Date(dateUTC.toLocaleString('en-US', { timeZone: userTimeZone }));

	// Formatear la fecha
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
	const formattedDate = dateInUserTZ.toLocaleDateString('en-US'/*, options*/);

	//console.log(dateInUserTZ, formattedDate)

	return formattedDate;
	
}

function localTime( date) {

	if(!date){
		return "";
	}

	// Convertir la fecha de nacimiento a la zona horaria del usuario
	const dateUTC = new Date(date);
	const dateInUserTZ = new Date(dateUTC.toLocaleString('en-US', { timeZone: userTimeZone }));

	// Formatear la fecha
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
	const formattedDate = dateInUserTZ.toLocaleTimeString('en-US'/*, options*/);

	

	return formattedDate;

	
	
}
