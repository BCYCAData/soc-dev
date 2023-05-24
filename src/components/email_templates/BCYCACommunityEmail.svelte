<script lang="ts">
	import {
		Button,
		Container,
		Column,
		Head,
		Heading,
		Hr,
		Html,
		Img,
		Link,
		Preview,
		Section,
		Text
	} from 'svelte-email';

	enum Heading1Type {
		events = 'Events Information',
		information = 'Information',
		workshops = 'Workshops Information'
	}

	export let heading1Type = Heading1Type.workshops;
	export let emailDescription = 'Requested Email to registered SOC Project User';
	export let titleText = `BCYCA Inc Information.`;
	export let previewText = `Here is the ${heading1Type} information you requested`;

	let border = 0;

	// console.log(heading1Type);
	// export let logoImage = `${baseUrl}/static/airbnb-review-user.jpg`;
	// export let copyrightText = `"Copyright © 2023 BCYCA Inc, All rights reserved."`;
	// export let ourEmailAddress = `"BCYCA@outlook.com"`;
	// export let ourPostalAddress = ['Alan Keown', '41 Skye Road', 'Barrington', 'NSW', '2422'];
	// export let headingText = `"Copyright © 2023 BCYCA Inc, All rights reserved."`;

	const fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';

	const fontFamilySystem =
		'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif';

	const line = {
		margin: '0 0 75px 0',
		backgroundColor: '#9a3412'
	};

	const main = {
		backgroundColor: '#ffffff'
	};
	const container = {
		margin: '0 auto',
		padding: '20px 0 48px',
		width: '680px'
	};
	const logo = {
		margin: '0 auto',
		'text-align': 'center'
	};
	const tableCell = { display: 'table-cell' };

	const heading1 = {
		fontFamily,
		fontSize: '32px',
		lineHeight: '32px',
		fontWeight: '300',
		color: '#9a3412'
	};
	const heading2 = {
		fontFamily,
		fontSize: '16px',
		lineHeight: '16px',
		fontWeight: '300',
		color: '#9a3412'
	};
	const section1 = {
		backgroundColor: '#ffedd5',
		width: '680px'
	};
	// Need:
	//     Want to change how you receive these emails?
	//      You can update your preferences or unsubscribe from this list.
	//          function - unscubscribe
	//          function - change preferences
</script>

<Html lang="en">
	<Head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
		<meta name="description" content={emailDescription} />
		<title>{titleText}</title>
		<style>
			body {
				margin: 0;
				background-color: #ffffff;
			}
			table {
				border-spacing: 0;
			}
			td {
				padding: 0;
			}
			img {
				border: 0;
			}
		</style>
	</Head>
	<Preview preview={previewText} />
	<Section style={main}>
		<Container style={container}>
			<Section style={section1}>
				<Hr style={line} />
				<!-- Header with 
                BCYCA Logo
                info type header (events | information | workshops)
            -->
				<Column>
					<!-- <Img src={`${baseUrl}/apple-logo.png`} width="42" height="42" alt="Apple Logo" /> -->
					<Img
						src="
				https://github.com/BCYCAData/soc-dev/blob/master/src/components/SOCLogo_half.png?raw=true"
						alt="Strengthen Our Community project logo"
						style={logo}
						width="64"
						height="64"
					/>
				</Column>

				<Column style={{ ...tableCell, align: 'center' }}>
					<Text style={{ ...heading1, 'text-align': 'center' }}>Your {heading1Type}</Text>
				</Column>
				<!-- <Column style={{ ...tableCell, align: 'center' }}> -->
				<Column style={{ ...tableCell, align: 'center' }}>
					<Text style={{ ...heading2, 'text-align': 'center' }}
						>From Burrell Creek Youth & Community Association Inc.</Text
					>
				</Column>
				<Hr style={line} />
			</Section>
			<!-- Body with 
                Information
                Why you are receiving this boilerplate
            -->
			<!-- Footer with 
                BCYCA Logo
                info type header (events | information | workshops)
            -->
		</Container></Section
	>
	<table
		align="left"
		{border}
		cellpadding="0"
		cellspacing="0"
		style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"
		width="100%"
		class="mcnTextContentContainer"
	>
		<tbody
			><tr>
				<td
					valign="top"
					class="mcnTextContent"
					style="padding: 0px 18px 9px;font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
				>
					<h1
						style="display: block;margin: 0;padding: 0;color: #202020;font-family: Helvetica;font-size: 26px;font-style: normal;font-weight: bold;line-height: 125%;letter-spacing: normal;text-align: left;"
					>
						NSW RFS Bush fire survival plan.
					</h1>

					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						You can make your plan online in as little as five minutes at&nbsp;<a
							href="https://us21.mailchimp.com/mctx/clicks?url=http%3A%2F%2Fwww.myfireplan.com.au.%2F&xid=ea67611f99&uid=189696630&iid=4d12d76eaf&pool=cts&v=2&c=1680847413&h=4b9072eb7ea4b37be78a023accad913fba0ae794690718b7f501c8c25841fa82"
							style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #007C89;font-weight: normal;text-decoration: underline;"
							>www.myfireplan.com.au.</a
						>.
					</p>

					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						Or you can sit down with your family and discuss what you will do using our guide to
						making a bush fire survival plan.<br />
						&nbsp;
					</p>

					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						<a
							href="https://us21.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fwww.rfs.nsw.gov.au%2F__data%2Fassets%2Fpdf_file%2F0003%2F36597%2FBFSP-Complete.pdf&xid=ea67611f99&uid=189696630&iid=4d12d76eaf&pool=cts&v=2&c=1680847413&h=0fe8959ae2bb6302f5450ebff9330035bf1bb25ae5b1a7347558a78a5ca4a0cc"
							style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #007C89;font-weight: normal;text-decoration: underline;"
							><strong>DOWNLOAD THE GUIDE&nbsp;</strong>and start your discussion</a
						>
					</p>
					<br />
					<strong>FOUR SIMPLE STEPS</strong>

					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						There are four simple steps to get ready for a bush fire:
					</p>
					STEP 1 DISCUSS&nbsp;<img
						alt="Step 1 Discuss"
						height="25"
						src="https://www.rfs.nsw.gov.au/__data/assets/image/0004/34708/4simplesteps_discuss_101.png"
						width="25"
						style="border: 0;height: auto !important;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"
					/><br />
					&nbsp; &nbsp; DISCUSS WHAT TO DO IF A BUSH FIRE THREATENS YOUR HOME
					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						Many households find that having a discussion over dinner works best as everybody is
						together and&nbsp;focussed.
					</p>

					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						<a
							href="https://us21.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fwww.rfs.nsw.gov.au%2F__data%2Fassets%2Fpdf_file%2F0015%2F36600%2FPlan-Step1-Discuss.pdf&xid=ea67611f99&uid=189696630&iid=4d12d76eaf&pool=cts&v=2&c=1680847413&h=581bf7e8ce97bda1d3b8e8b39f796276486def1e0dbf2a8e6424e5f523f0a148"
							rel="external"
							target="_blank"
							style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #007C89;font-weight: normal;text-decoration: underline;"
							>Download the Step 1 discussion guide (PDF, 985.3 KB).</a
						>
					</p>
					<br />
					STEP 2 PREPARE<img
						alt="Step 2 Prepare"
						height="25"
						src="https://www.rfs.nsw.gov.au/__data/assets/image/0016/34711/4simplesteps_Prepare101.png"
						width="25"
						style="border: 0;height: auto !important;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"
					/><br />
					&nbsp; &nbsp; PREPARE YOUR HOME AND GET IT READY FOR BUSH FIRE SEASON&nbsp;<br />
					<br />
					There are simple things you can do around your home to prepare it for a bush fire, like keeping
					the grass low and having a cleared area around your home
					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						<a
							href="https://us21.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fwww.rfs.nsw.gov.au%2F__data%2Fassets%2Fpdf_file%2F0005%2F36599%2FPlan-Step2-Prepare.pdf&xid=ea67611f99&uid=189696630&iid=4d12d76eaf&pool=cts&v=2&c=1680847413&h=58df4ac43e6b3f41860a05cfd62e016ea96dac27ee879bf4bea94f4dd18db445"
							rel="external"
							target="_blank"
							style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #007C89;font-weight: normal;text-decoration: underline;"
							>Download the Step 2 checklist (PDF, 595.5 KB).</a
						>
					</p>

					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						STEP 3&nbsp;KNOW&nbsp;&nbsp;<img
							alt="Step 3 Know"
							height="25"
							src="https://www.rfs.nsw.gov.au/__data/assets/image/0015/34710/4simplesteps_Know_100.png"
							width="20"
							style="border: 0;height: auto !important;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"
						/><br />
						&nbsp; &nbsp; KNOW THE BUSH FIRE ALERT LEVELS
					</p>

					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						If there is a fire in your area you will find its alert level on the NSW RFS website and
						in the ‘Fires Near Me’ app. You need to keep track of the alert level so you know what
						you should do.
					</p>

					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						<a
							href="https://us21.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fwww.rfs.nsw.gov.au%2F__data%2Fassets%2Fpdf_file%2F0004%2F36598%2FPlan-Step3-Know.pdf&xid=ea67611f99&uid=189696630&iid=4d12d76eaf&pool=cts&v=2&c=1680847413&h=764131650bbf58a44337b78bdf7e789c2c1e8dc288b223d210ca7acf74d05585"
							rel="external"
							target="_blank"
							style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #007C89;font-weight: normal;text-decoration: underline;"
							>Download Step 3 (PDF, 227.4 KB).</a
						>
					</p>
					<br />
					STEP 4&nbsp;KNOW&nbsp;&nbsp;<img
						alt="Step 4 Keep"
						height="25"
						src="https://www.rfs.nsw.gov.au/__data/assets/image/0005/34709/4simplesteps_Keep_101.png"
						width="21"
						style="border: 0;height: auto !important;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"
					/><br />
					&nbsp; &nbsp; KEEP ALL THE BUSH FIRE INFORMATION NUMBERS, WEBSITES AND THE SMARTPHONE APP
					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						In a bush fire, it’s important that you stay up to date on conditions in your area.
					</p>

					<p
						style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-size: 16px;line-height: 150%;text-align: left;"
					>
						<a
							href="https://us21.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fwww.rfs.nsw.gov.au%2F__data%2Fassets%2Fpdf_file%2F0011%2F36596%2FPlan-Step4-Keep.pdf&xid=ea67611f99&uid=189696630&iid=4d12d76eaf&pool=cts&v=2&c=1680847413&h=e3d17c853493512dd0b94f708bc2bc6f49286f30f341111a4c3722e02fa87460"
							rel="external"
							target="_blank"
							style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #007C89;font-weight: normal;text-decoration: underline;"
							>Download Step 4 (PDF, 219.1 KB).</a
						>
					</p>
				</td>
			</tr>
		</tbody>
	</table>
</Html>
