const Order = require("../models/order");
const PDFDocument = require("pdfkit");

let userTimeZone = "America/Caracas";

module.exports.list = async (req, res, next) => {
	try {
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

		
		
		const count = await Order.count(cond);
		let orders = await Order.find(cond)
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
		

		res.status(200).json({
			//data: orders.map((o)=>{return {id:o.id, buyer1:o.buyer1, system1:o.system1, price: o.price}; }),
			data: orders,
			count,
		});
	} catch (error) {
		
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
		
		let order = await Order.findOne(condition).lean();

		res.status(200).json({
			data: order,
			message: "record recovery correctly!",
		});
	} catch (e) {
		
		res.status(400).json(e);
	}
};

module.exports.add = async (req, res) => {
	try {
		const orderData = req.body;
		orderData._id = undefined;

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
		const newOrder = new Order(orderData);
		await newOrder.save();

		newOrder.buyer1.signature = newOrder.buyer1.signature.toString("base64");
		newOrder.buyer2.signature = newOrder.buyer2.signature.toString("base64");
		newOrder.employee.signature = newOrder.employee.signature.toString("base64");
		newOrder.approvedBy.signature = newOrder.approvedBy.signature.toString("base64");

		let order = await Order.findOne({_id: newOrder._id}).lean();
		

		res
			.status(201)
			.send({ data: order, message: "record added correctly!" });
	} catch (error) {
		
		res.status(400).send({ message: error.message });
	}
};

module.exports.edit = async (req, res, next) => {
	try {
		const orderData = req.body;

		
		const id = orderData._id;
		//orderData._id = undefined

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

		//orderData.createdOn = Date.now(),
		orderData.updatedOn = Date.now();
		
		

		let order = await Order.findByIdAndUpdate(
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
	let deletedOrder = await Order.deleteOne({ _id: id });

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
		let order = await Order.findOne({ _id: id });

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
	const AquafeelSolutions =
		//"Aquafeel Solutions propone proveer todos los produtos, materiales y mano de obra para instalar lo especificado a continuacion y el comprador(es) ordena y compra los produtos, materiales y mano de obra e instalacion de lo especificado a continuacion:";
	"Aquafeel Solutions proposes to provide all products, materials, and labor to install the specified items below, and the buyer(s) orders and purchases the products, materials, labor, and installation of the specified items below:"
	const THIS_CONTRACT_IS =
		"THIS CONTRACT IS VALID ONLY UPON SIGNED APROVAL BY EMPLOYED MANAGEMENT PRESONNEL OF AQUAFEEL SOLUTIONS. SEE TERMS AND CONDITIONS ON REVERSE SIDE. A RESTOCKING FEE OF 20%. WILL BE CHARGE FOR TRANSACTIONS THAT ARE CANCELLED AFTER THREE DAY WATING PERIOD.";
	const TEXT_230_Capcom =
		"230 Capcom Ave Ste. 103, Wake Forest NC 27587 - Ph (919) 790-5475 - Fax (919) 790-5476 \nwww.aquafeelmaryland.com - info@aquafeelvirginia.com";

	const UPON_SIGNING =
		"Upon signing, you acknowledge you agree to the terms and conditions of this contract. You agreed to all payments and charges and to the sales price appearing bellow.";
	const DO_NOT_SIGNED =
		"DO NOT SIGNED THIS CONTRACT UNTILL YOU HAVE READ IT ALL OF THE BLANK SPACES ARE COMPLETED. YOU HAVE THE RIGHT TO RECEIVE A COMPLETE COPY OF THIS CONTRACT. YOU HAVE THE RIGHT TO PREPAY FULL AMOUNT AT ANY TIME AND TO BE NOTIFIED OF THE FULL AMOUNT DUE.";
		const CASH_PRICE = "CASH PRICE";
		const FINACED = "FINANCED"
	
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
	const cellFontSize = 9;
	const noteFontSize = 7;
	const startX = 15;
	const startY = 25;

	const rowHeight = 22;

	try {
		let id = req.query.id;
		userTimeZone = req.query.userTimeZone || userTimeZone;
		let order = await Order.findOne({ _id: id }).populate("createdBy");

		
		if (!order) {
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
		res.setHeader("Content-Disposition", `inline; filename="${order.buyer1.name}.pdf"`);

		doc.pipe(res);

		doc.font("Times-Bold");

		//doc.image('uploads/Aquafeel-Blue-Logo.png', 0, 15, {width: 250})
		// .text('Proportional to width', 0, 0);

		doc.image("uploads/Aquafeel-Blue-Logo.png", 15, 25, {
			fit: [bodyWidth, 50],
			align: "center",
			valign: "center",
		});
		doc.moveDown();
		doc.fontSize(fontSize).text("", startX, rowHeight * 4);

		doc.fontSize(fontTitle).text("PROPOSAL - WORK ORDER - CONTRACT", {
			width: bodyWidth,
			align: "center",
		});
		doc.font("Times-Roman");
		doc.fontSize(fontSize).text("", startX, rowHeight);
		const data = {
			//headers: [],
			rows: [
				[
					`BUYER 1:* ${order.buyer1.name}`,
					`PHONE 1:* ${order.buyer1.phone}`,
					`CEL:* ${order.buyer1.cel}`,
				],
				[
					`BUYER 2:* ${order.buyer2.name}`,
					`PHONE 2:* ${order.buyer2.phone}`,
					`CEL:* ${order.buyer2.cel}`,
				],
			],
		};

		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data,
			startX,
			startY + rowHeight * 4,
			[275, 160, 150],
			rowHeight
		);

		const data7 = {
			//headers: [],
			rows: [
				[
					`ADDRESS:* ${order.address}`,
					`CITY:* ${order.city}`,
					`STATE:* ${order.state}`,
					`ZIP:* ${order.zip}`,
				],
			],
		};

		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data7,
			startX,
			startY + rowHeight * 6,
			[275, 130, 100, 80],
			rowHeight
		);

		doc.fontSize(noteFontSize).text("", startX, startY + rowHeight * 7.1);
		//doc.fontSize(noteFontSize).text(text1, startX, startY + rowHeight * 7.1);
		doc.fontSize(noteFontSize).text(AquafeelSolutions, {
			width: 585,
			align: "left",
		});


		let list = ""
		let nList = 0;

		if(order.installation.s0) {
			list += `                              - WHOLE HOUSE AQUAFEEL SYSTEM\n`;
			nList++;
		}
		if(order.installation.s1) {
			list += `                              - REVERSE OSMOSIS\n`;
			nList++;
		}
		if(order.installation.s2) {
			list += `                              - REVERSE OSMOSIS + ALKALINE\n`;
			nList++;
		}
		if(order.installation.s3) {
			list += `                              - NATURAL SOAP PACKAGE`;
			nList++;
		}

		const data2 = {
			//headers: [],
			rows: [
				[
					`Water System Treatment:* \n${list}`
				]
				//[`Other \n  ${order.promotion}`, ``, ``],
			],
		};
		


		if(nList>=4) {
			doc.fontSize(7);
		} else {
			doc.fontSize(cellFontSize);
		}

		
		drawTable(
			doc,
			data2,
			startX,
			startY + rowHeight * 8,
			[bodyWidth],
			rowHeight * 2
		);


		/*
		const data2 = {
			//headers: [],
			rows: [
				[
					`Name: ${order.system1.name}`,
					`Brand: ${order.system1.brand}`,
					`Model: ${order.system1.model}`,
				],
				[
					`Name: ${order.system2.name}`,
					`Brand: ${order.system2.brand}`,
					`Model: ${order.system2.model}`,
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
		*/

		const data9 = {
			//headers: [],
			rows: [[`Other / Promotion: *${order.promotion}`]],
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
		doc.font("Times-Bold");
		doc.fontSize(fontTitle).text("INSTALLATION INSTRUCTIONS", {
			width: 585,
			align: "center",
		});
		doc.font("Times-Roman");

		
		const data3 = {
			//headers: ['A', 'B', 'C', "D"],
			rows: [
				[
					`DAY OF INTALLATION:* ${order.installation.day}`,
					`DATE:* ${localDate(order.installation.date)}`,
					`CONEXION ICE MAKER:* ${order.installation.iceMaker ? "Yes" : "No"}`,
					`TIME:* ${localTime(order.installation.date)}`,
				],
			],
		};
		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data3,
			startX,
			startY + rowHeight * 13,
			[176, 116, 146, 146],
			rowHeight
		);

		const data31 = {
			//headers: ['A', 'B', 'C', "D"],
			rows: [
				[
					`People involved:* ${order.people}`,
					""//`Floor Type: ${order.floorType}`,
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
		doc.font("Times-Bold");
		doc.fontSize(fontTitle).text("", startX, rowHeight * 17);
		doc.fontSize(fontTitle).text("Terms or Payment Methods".toUpperCase(), {
			width: 585,
			align: "center",
		});
		doc.font("Times-Roman");
		const data21 = {
			//headers: [],
			rows: [
				[
					`CREDIT CARD (SIGNED ATTACHED FORM):* ${order.creditCard ? "Yes" : "No"
					}`,
					`CHECK (PAYABLE TO AQUAFEEL SOLUTIONS):* ${order.check ? "Yes" : "No"
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

		doc.font("Times-Bold");
		doc.fontSize(cellFontSize).text("", startX, startY + 165 + rowHeight * 12);
		doc.fontSize(fontTitle).text(CASH_PRICE, {
			width: 585,
			align: "center",
		});
		doc.fontSize(cellFontSize).text("", startX, startY + 231 + rowHeight * 12);
		doc.fontSize(fontTitle).text(FINACED, {
			width: 585,
			align: "center",
		});

		doc.font("Times-Roman");


		const data4 = {
			headers: [
				"Price",
				"Downpayment",
				"Installation",
				"Taxes",
				"Total Cash Price",
			],
			rows: [
				[
					"*"+ order.price.cashPrice,
					"*" + order.price.downPayment,
					"*" + order.price.installation,
					"*" + order.price.taxes,
					"*" + order.price.totalCashPrice,
					
				],
			],
		};
		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data4,
			startX,
			startY + rowHeight * 20,
			[117, 117, 117, 117, 117],
			rowHeight,
			"center"
		)
		/*const data4 = {
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
					"*"+ order.price.cashPrice,
					"*" + order.price.installation,
					"*" + order.price.taxes,
					"*" + order.price.totalCash,
					"*" + order.price.downPayment,
					"*" + order.price.totalCashPrice,
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
		);*/


		let apr = " ";
		if (order.price.APR > 0){
			apr = order.price.APR + " %";
		} 

		let terms = order.price.terms.terms;
		if (order.price.terms.unit != "" && order.price.terms.terms == ""){
			terms = `${order.price.terms.amount} ${order.price.terms.unit}`;
		}

		const data5 = {
			headers: [
				"Amount to Finance",
				"Terms",
				"A.P.R ( % )",
				"Final Price"
				
			],
			rows: [
				[
					"*" + order.price.toFinance,
					"*" + terms,
					"*" + apr,
					"*" + order.price.totalPayments,
					
				],
			],
		};
		doc.fontSize(cellFontSize);
		drawTable(
			doc,
			data5,
			startX,
			startY + rowHeight * 23,
			[147, 146, 146, 146],
			rowHeight,
			"center"
		);
		/*const data5 = {
			headers: [
				"Amount to Finance",
				"Terms",
				"A.P.R ( % )",
				"Finance Charge",
				"Total of Payments",
			],
			rows: [
				[
					"*" + order.price.toFinance,
					"*" + terms,
					"*" + apr,
					"*" + order.price.finaceCharge,
					"*" + order.price.totalPayments,
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
		);*/

		doc.fontSize(cellFontSize).text("", startX, rowHeight * 27);
		doc.fontSize(noteFontSize).text(DO_NOT_SIGNED.toUpperCase(), {
			width: 585,
			align: "left",
		});

		let sign1 = ( order.buyer1.signature.length > 0) ? { content: order.buyer1.signature } : "( no signature )";
		let sign2 = ( order.buyer2.signature.length > 0) ? { content: order.buyer2.signature } : "( no signature )";
		let sign3 = ( order.employee.signature.length > 0) ? { content: order.employee.signature } : "( no signature )";
		let sign4 = ( order.approvedBy.signature.length > 0) ? { content: order.approvedBy.signature } : "( no signature )";

		const data6 = {
			//headers: ['Amount to Finance', 'Payment Terms', 'A.P.R', "Finance Charge", "Total of Payments"],
			rows: [
				[
					"APROVAL / BUYER 1",
					sign1,
					"DATE",
					`${localDate(order.buyer1.date)}`,
				],
				[
					"APROVAL / BUYER 2",
					sign2,
					"DATE",
					`${localDate(order.buyer2.date)}`,
				],
				[
					`${(order.createdBy?.firstName || "") + (" " + order.createdBy?.lastName || "") }\nREP. DE AQUAFEEL SOLUTIONS` ,
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
				doc.image(imgDataUrl, x + 5, y + 5 - 20 + 10, {
					fit: [columnWidths[i] - 10, rowHeight - 10 + 5],
					align: 'center',
					valign: 'top',
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
		doc.font("Times-Bold");
		data.headers.forEach((header, i) => {
			doc.text(header, x + 5, y + 5, {
				width: columnWidths[i] - 10,
				align: align,
			});
			x += columnWidths[i];
		});
		doc.font("Times-Roman");
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
		let cells = [];
		row.forEach((cell, i) => {
			if (typeof cell === 'string') {
				cell = cell.toUpperCase();

				cells = cell.split("*");
			
			}
			//doc.font("Times-Roman");
			if(cells[1]) {
				doc.font("Times-Bold");
				doc.text(cells[0], x + 5, y + 5, {
					width: columnWidths[i] - 10,
					align: align,
					continued: true
				});
				//doc.font("Times-Roman");
				doc.font("Times-Roman").text(cells[1], {
					width: columnWidths[i] - 10,
					align: align,
				});
				//doc.font("Times-Roman");
			}else{
				doc.text(cell, x + 5, y + 5, {
					width: columnWidths[i] - 10,
					align: align,
				});
			}
			
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
