<script lang="ts">
	import { Head, Html, Preview, Section } from 'svelte-email';

	// 	import {
	// 	Button,
	// 	Container,
	// 	Column,
	// 	Head,
	// 	Heading,
	// 	Hr,
	// 	Html,
	// 	Img,
	// 	Link,
	// 	Preview,
	// 	Section,
	// 	Text
	// } from 'svelte-email';

	enum Heading1Type {
		events = 'Events Information',
		information = 'Information',
		workshops = 'Workshops Information'
	}

	export let heading1Type = Heading1Type.workshops;
	export let emailDescription = 'Requested Email to registered SOC Project User';
	export let titleText = `BCYCA Inc Information.`;
	export let previewText = `Here is the ${heading1Type} information you requested`;

	const border = 0;

	// const fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';

	// const fontFamilySystem =
	// 	'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif';

	const main = {
		backgroundColor: '#ffffff'
	};
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
		<table
			style="width:680px;background-color:#ffedd5;"
			align="center"
			{border}
			cellpadding="0"
			cellspacing="0"
			role="presentation"
		>
			<tbody
				><tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column;">
					<td style="display:inline-flex;justify-content:center;align-items:center;">
						<img
							alt="Strengthen Our Community project logo"
							src="
				https://github.com/BCYCAData/soc-dev/blob/master/src/components/SOCLogo_half.png?raw=true"
							width="64"
							height="64"
							style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto;text-align:center;"
						/></td
					>
					<td style="display:table-cell;justify-content:center;align-items:center;align:center;"
						><p
							style="font-size:32px;line-height:32px;margin:16px 0;font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-weight:300;color:#9a3412;text-align:center;"
						>
							Your Workshops Information
						</p></td
					>

					<td style="display:table-cell;justify-content:center;align-items:center;align:center;"
						><p
							style="font-size:16px;line-height:16px;margin:16px 0;font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-weight:300;color:#9a3412;text-align:center;"
						>
							From Burrell Creek Youth &amp; Community Association Inc.
						</p></td
					>
				</tr></tbody
			>
		</table>

		<table
			style="background-color:#ffedd5"
			width="100%"
			{border}
			cellpadding="0"
			cellspacing="0"
			align="center"
		>
			<tbody
				><tr>
					<td align="center" valign="top" width="800" />
				</tr>
				<tr>
					<td align="center">
						<table
							cellspacing="0"
							cellpadding="0"
							{border}
							width="800"
							class="container"
							align="center"
							style="background-color:aquamarine"
						>
							<tbody
								><tr>
									<td />
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr>
					<td valign="top" />
				</tr>
			</tbody>
		</table>
		<table
			align="center"
			{border}
			cellpadding="0"
			cellspacing="0"
			style="max-width: 680px;min-width: 680px;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"
			width="680px"
		>
			<tbody style="background-color:#ffedd5"
				><tr>
					<td
						valign="top"
						style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #656565;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;"
					>
						<em>Copyright © 2023 Alan Keown, All rights reserved.</em>
						<br />
						Want to change how you receive these emails?<br />
						You can
						<a
							href="https://soc-dev.vercel.app/profile"
							style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #656565;font-weight: normal;text-decoration: underline;"
							>update your preferences</a
						>
						or
						<a
							href="https://soc-dev.vercel.app/unsubscribe?u=fcb183115b695644c0721deea&amp;id=cdc11189af&amp;e=[UNIQID]&amp;c=2e15d8b2d8"
							style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #656565;font-weight: normal;text-decoration: underline;"
							>unsubscribe from this list</a
						>
					</td>
				</tr>
			</tbody>
		</table>
	</Section></Html
>
