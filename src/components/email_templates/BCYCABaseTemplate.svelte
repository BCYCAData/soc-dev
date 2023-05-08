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

	const border = 0;

	const fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';

	const fontFamilySystem =
		'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif';

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
					<td
						style="display:inline-flex;justify-content:center;align-items:center;"
						role="presentation"
					>
						<img
							alt="Strengthen Our Community project logo"
							src="
				https://github.com/BCYCAData/soc-dev/blob/master/src/components/SOCLogo_half.png?raw=true"
							width="64"
							height="64"
							style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto;text-align:center;"
						/></td
					>
					<td
						style="display:table-cell;justify-content:center;align-items:center;align:center;"
						role="presentation"
						><p
							style="font-size:32px;line-height:32px;margin:16px 0;font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-weight:300;color:#9a3412;text-align:center;"
						>
							Your Workshops Information
						</p></td
					>

					<td
						style="display:table-cell;justify-content:center;align-items:center;align:center;"
						role="presentation"
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
									<td>
										<!-- <table
											width="100%"
											{border}
											cellpadding="0"
											cellspacing="0"
											class="tb_properties border_style"
											style="background-color:aquamarine;"
										>
											<tbody
												><tr>
													<td align="center" valign="top">
														<table
															align="left"
															{border}
															cellpadding="0"
															cellspacing="0"
															width="100%"
															style="background-color:blueviolet"
														>
															<tbody
																><tr>
																	<td class="content_padding" style="">
																		<table
																			{border}
																			cellpadding="0"
																			cellspacing="0"
																			width="100%"
																			style="background-color:coral"
																		>
																			<tbody
																				><tr>
																					<td align="center" class="header" valign="top">
																						<table
																							align="left"
																							{border}
																							cellpadding="0"
																							cellspacing="0"
																							width="100%"
																						>
																							<tbody>
																								<tr>
																									<td align="left" valign="top">
																										<table
																											{border}
																											cellpadding="0"
																											cellspacing="0"
																											style="width:100%"
																										>
																											<tbody>
																												<tr>
																													<td
																														class="responsive-td"
																														valign="top"
																														style="width: 100%;"
																													>
																														<table
																															role="presentation"
																															style="background-color: #D9D9D9; min-width: 100%; "
																															class="slot-styling"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 0px; "
																																		class="slot-styling camarker-inner"
																																	>
																																		<table
																																			cellpadding="0"
																																			cellspacing="0"
																																			width="100%"
																																			style="background-color: #D9D9D9; min-width: 100%; "
																																			class="stylingblock-content-wrapper"
																																		>
																																			<tbody
																																				><tr
																																					><td
																																						style="padding: 10px 0px; "
																																						class="stylingblock-content-wrapper camarker-inner"
																																					>
																																						<div
																																							style="text-align: center;"
																																						/></td
																																					></tr
																																				></tbody
																																			>
																																		</table>
																																	</td></tr
																																></tbody
																															>
																														</table>
																													</td>
																												</tr>
																											</tbody>
																										</table>
																									</td>
																								</tr>
																							</tbody>
																						</table>
																					</td>
																				</tr>
																				<tr>
																					<td align="center" class="header" valign="top">
																						<table
																							align="left"
																							{border}
																							cellpadding="0"
																							cellspacing="0"
																							width="100%"
																						>
																							<tbody>
																								<tr>
																									<td align="left" valign="top">
																										<table
																											{border}
																											cellpadding="0"
																											cellspacing="0"
																											style="width:100%"
																										>
																											<tbody>
																												<tr>
																													<td
																														class="responsive-td"
																														valign="top"
																														style="width: 100%; text-decoration:none;"
																													>
																														<table
																															role="presentation"
																															style="background-color: transparent; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 0px 0px 20px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		>
                                                                                                                                        <table
																																			role="presentation"
																																			style="width: 100%;"
																																			cellspacing="0"
																																			cellpadding="0"
																																		>
																																			<tbody
																																				><tr
																																					><td
																																						><table
																																							role="presentation"
																																							style="width: 100%;"
																																							cellspacing="0"
																																							cellpadding="0"
																																						>
																																							<tbody
																																								><tr
																																									><td
																																										class="responsive-td"
																																										style="width: 100%;"
																																										valign="top"
																																									>
																																										<table
																																											role="presentation"
																																											style="background-color: transparent; min-width: 100%; "
																																											class="stylingblock-content-wrapper mobile-hidden"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														style="padding: 0px; "
																																														class="stylingblock-content-wrapper mobile-hidden camarker-inner"
																																														><table
																																															role="presentation"
																																															width="100%"
																																															cellspacing="0"
																																															cellpadding="0"
																																														>
																																															<tbody
																																																><tr
																																																	><td
																																																		align="center"
																																																	>
																																																		<img
																																																			data-assetid="26874"
																																																			src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/5/179e74e4-7b19-4d9d-b51c-9873a9fb2f8f.png"
																																																			alt="Get the best from your Telstra Pre-Paid"
																																																			style="display: block; padding: 0px; text-align: center; height: 425px; width: 800px; border: 0px;"
																																																			width="800"
																																																			height="425"
																																																		/></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>

																																										<table
																																											role="presentation"
																																											style="min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														class="stylingblock-content-wrapper camarker-inner"
																																														>
                                                                                                                                                                                        <table
																																															role="presentation"
																																															class="photo logo"
																																															style="display: none;"
																																															width="100%"
																																															cellspacing="0"
																																															cellpadding="0"
																																														>
																																															<tbody
																																																><tr
																																																	><td
																																																		align="center"
																																																	>
																																																		<img
																																																			data-assetid="26878"
																																																			src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/5/97980350-8142-46e5-b5fe-29d3ad659d04.png"
																																																			alt="Get the best from your Telstra Pre-Paid"
																																																			style="display: block; padding: 0px; text-align: center; height: 560px; width: 430px; border: 0px;"
																																																			width="430"
																																																			height="560"
																																																		/></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>
																																									</td></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>
																													</td>
																												</tr>
																											</tbody>
																										</table>
																									</td>
																								</tr>
																							</tbody>
																						</table>
																					</td>
																				</tr>
																				<tr>
																					<td align="center" class="header" valign="top">
																						<table
																							align="left"
																							{border}
																							cellpadding="0"
																							cellspacing="0"
																							width="100%"
																						>
																							<tbody>
																								<tr>
																									<td align="left" valign="top">
																										<table
																											{border}
																											cellpadding="0"
																											cellspacing="0"
																											style="width:100%; text-decoration:none;"
																										>
																											<tbody>
																												<tr>
																													<td
																														class="responsive-td"
																														valign="top"
																														style="width: 100%;"
																													>
																														<table
																															role="presentation"
																															style="background-color: transparent; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 0px 0px 40px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table width="100%">
																																			<tbody
																																				><tr>
																																					<td
																																						class="body-padding-mobile"
																																						style="padding: 0 120px;"
																																					>
																																						Welcome, and thanks for
																																						selecting a Telstra
																																						Mobile Broadband Plan.<br
																																						/>
																																						<br />
																																						Now your new Mobile Broadband
																																						plan has started, here's
																																						an overview of the features
																																						and benefits you'll enjoy
																																						- plus handy tips for a seamless
																																						experience.</td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>
																													</td>
																												</tr>
																											</tbody>
																										</table>
																									</td>
																								</tr>
																							</tbody>
																						</table>
																					</td>
																				</tr>
																				<tr>
																					<td align="center" class="header" valign="top">
																						<table
																							align="left"
																							{border}
																							cellpadding="0"
																							cellspacing="0"
																							width="100%"
																						>
																							<tbody>
																								<tr>
																									<td align="left" valign="top">
																										<table
																											{border}
																											cellpadding="0"
																											cellspacing="0"
																											style="width:100%"
																										>
																											<tbody>
																												<tr>
																													<td
																														class="responsive-td"
																														valign="top"
																														style="width: 100%;"
																													>
																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 40px 0px 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			role="presentation"
																																			width="100%"
																																			cellspacing="0"
																																			cellpadding="0"
																																		>
																																			<tbody
																																				><tr
																																					><td
																																						class="msoPadding body-padding-mobile"
																																						style="padding: 0px 120px;"
																																						align="left"
																																						><img
																																							data-assetid="26553"
																																							src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/5/4ed30a6e-0e38-423e-8f3d-54e6c6836711.png"
																																							alt="Telstra logo"
																																							style="display: block; padding: 0px; text-align: left; height: 70px; width: 70px; border: 0px;"
																																							width="70"
																																							height="70"
																																						/></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>

																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr>
																																	<td
																																		style="padding: 20px 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			width="100%"
																																			cellspacing="0"
																																			cellpadding="0"
																																			align="center"
																																		>
																																			<tbody
																																				><tr>
																																					<td
																																						class="body-padding-mobile"
																																						style="text-align: left; color:#570066; line-height:30px; font-size: 20px; padding:0 120px;"
																																					>
																																						Manage it all with the
																																						My Telstra app.</td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>

																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table width="100%">
																																			<tbody
																																				><tr>
																																					<td
																																						class="body-padding-mobile"
																																						style="padding: 0 120px;"
																																					>
																																						Managing your Mobile
																																						Broadband plan is so
																																						easy. The My Telstra app
																																						has everything you need
																																						in one place, letting
																																						you monitor your data,
																																						contact us for support
																																						via messaging, set up
																																						hassle-free auto
																																						recharge payments and
																																						more. So you can keep
																																						doing what you love on
																																						Australia's largest
																																						mobile network.</td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>

																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 20px 0px 40px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			style="background-color: transparent; min-width: 100%;"
																																			width="100%"
																																			cellspacing="0"
																																			cellpadding="0"
																																			{border}
																																			align="center"
																																		>
																																			<tbody
																																				><tr>
																																					<td
																																						id="cta-mobile-left-padding"
																																						style="padding-left: 120px; mso-padding-alt: 0 0 0 117px;"
																																					>
																																						<table
																																							width="100%"
																																							cellspacing="0"
																																							cellpadding="0"
																																							{border}
																																						>
																																							<tbody
																																								><tr>
																																									<td
																																										align="center"
																																									>
																																										<table
																																											class="button-color-to-magenta"
																																											style="border: 1px solid #570066 background-color: #ffffff;"
																																											cellspacing="0"
																																											cellpadding="0"
																																											{border}
																																											align="left"
																																										>
																																											<tbody
																																												><tr>
																																													<td
																																														class="cta-mobile"
																																														style="border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px;  #FFEFF7; text-align: center; padding: 11px 11px 11px 14px; text-decoration: none;font-weight: bold background-color: #ffffff;"
																																														valign="middle"
																																														align="left"
																																													>
																																														<a
																																															data-linkto="other"
																																															href="https://click.messages.telstra.com/?qs=132d2c11df71aa9ff593aeb4a7c6533563b5059978a3bb0cccea902596f21e71c29884438ab29d9b9a83b208345dea9f4f53773530546d5d522c8b52fc0a00f0"
																																															style="color:#570066;text-decoration:none; font-size: 16px; text-align: left; font-weight: bold; display: block; background-color: #FFEFF7; border: 0px; border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px;"
																																															target="_blank"
																																															title="Download My Telstra"
																																															>Download
																																															My
																																															Telstra&nbsp;
																																															&nbsp;&nbsp;<span
																																																class="button-arrow-magenta"
																																																>&gt;</span
																																															></a
																																														></td
																																													></tr
																																												></tbody
																																											>
																																										</table></td
																																									></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>
																													</td>
																												</tr>
																											</tbody>
																										</table>
																									</td>
																								</tr>
																							</tbody>
																						</table>
																					</td>
																				</tr>
																				<tr>
																					<td align="center" class="header" valign="top">
																						<table
																							align="left"
																							{border}
																							cellpadding="0"
																							cellspacing="0"
																							width="100%"
																						>
																							<tbody>
																								<tr>
																									<td align="left" valign="top">
																										<table
																											{border}
																											cellpadding="0"
																											cellspacing="0"
																											style="width:100%"
																										>
																											<tbody>
																												<tr>
																													<td
																														class="responsive-td"
																														valign="top"
																														style="width: 100%; text-decoration:none;"
																													>
																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			width="100%"
																																			cellspacing="0"
																																			cellpadding="0"
																																			{border}
																																			align="center"
																																		>
																																			<tbody
																																				><tr>
																																					<td
																																						class="body-padding-mobile"
																																						style="padding:0 120px"
																																						valign="middle"
																																						align="center"
																																					>
																																						<table
																																							width="100%"
																																							cellspacing="0"
																																							cellpadding="0"
																																							{border}
																																						>
																																							<tbody
																																								><tr>
																																									<td
																																										class="fluid"
																																										style="font-size: 0px; line-height: 0%; mso-line-height-rule: exactly; border-bottom:1px solid #570066;"
																																										height="1"
																																									>
																																										<img
																																											src="http://image.messages.telstra.com/lib/fe32157075640574741d78/m/1/66ab0af1-52a2-492a-bdba-d4eaf17a314f.gif"
																																											style="display:block; font-size: 0px; line-height: 0%; mso-line-height-rule: exactly border: 0;"
																																											width="1"
																																											height="1"
																																											alt="Telstra logo"
																																										/></td
																																									></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>

																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 40px 0px 20px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			width="100%"
																																			cellspacing="0"
																																			cellpadding="0"
																																			align="center"
																																		>
																																			<tbody
																																				><tr>
																																					<td
																																						class="body-padding-mobile"
																																						style="text-align: left; color:#570066; line-height:30px; font-size: 20px; padding:0 120px;"
																																					>
																																						Explore the benefits of
																																						your plan.</td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>
																													</td>
																												</tr>
																											</tbody>
																										</table>
																									</td>
																								</tr>
																							</tbody>
																						</table>
																					</td>
																				</tr>

																				<tr>
																					<td align="center" class="header" valign="top">
																						<table
																							align="left"
																							{border}
																							cellpadding="0"
																							cellspacing="0"
																							width="100%"
																						>
																							<tbody>
																								<tr>
																									<td align="left" valign="top">
																										<table
																											{border}
																											cellpadding="0"
																											cellspacing="0"
																											style="width:100%"
																										>
																											<tbody>
																												<tr>
																													<td
																														class="responsive-td"
																														valign="top"
																														style="width: 100%; text-decoration:none;"
																													>
																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 20px 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			style="width: 100%;"
																																			cellspacing="0"
																																			cellpadding="0"
																																		>
																																			<tbody
																																				><tr
																																					><td
																																						><table
																																							style="width: 100%;"
																																							cellspacing="0"
																																							cellpadding="0"
																																						>
																																							<tbody
																																								><tr
																																									><td
																																										style="width: 22%; padding-right: 0px;"
																																										valign="top"
																																									>
																																										<table
																																											role="presentation"
																																											style="min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														class="stylingblock-content-wrapper camarker-inner"
																																														><table
																																															role="presentation"
																																															width="100%"
																																															cellspacing="0"
																																															cellpadding="0"
																																														>
																																															<tbody
																																																><tr
																																																	><td
																																																		class="body-padding-mobile-left"
																																																		style="padding: 5px 0 0 0;"
																																																		align="right"
																																																	>
																																																		<img
																																																			data-assetid="26561"
																																																			src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/5/b69f0328-ed16-4511-8284-bf0899f4d58b.png"
																																																			alt="Australia logo "
																																																			style="display: block; text-align: right; padding: 0px; height: 55px; width: 55px; border: 0px;"
																																																			width="55"
																																																			height="55"
																																																		/></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>
																																									</td><td
																																										style="width: 78%; padding-left: 0px;"
																																										valign="top"
																																									>
																																										<table
																																											role="presentation"
																																											style="min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														class="stylingblock-content-wrapper camarker-inner"
																																														><table
																																															style="padding: 0 valign: 'top';"
																																															align="left"
																																														>
																																															<tbody
																																																><tr
																																																>
																																																	<td
																																																		class="body-padding-mobile-right"
																																																		style="padding: 0 120px 0 0;"
																																																	>
																																																		<table
																																																		>
																																																			<tbody
																																																				><tr
																																																				>
																																																					<td
																																																						style="font-size: 20px; padding: 0 0 0 25px; mso-padding-alt: 5px 0 0 25px; color:#570066;"
																																																					>
																																																						Australia's
																																																						largest
																																																						mobile
																																																						network</td
																																																					></tr
																																																				><tr
																																																				>
																																																					<td
																																																						style="padding: 10px 0 0 25px; mso-padding-alt: 14px 0 0 25px;"
																																																					>
																																																						Connect
																																																						to
																																																						the
																																																						things
																																																						that
																																																						matter,
																																																						with
																																																						Australia's
																																																						largest
																																																						mobile
																																																						network.</td
																																																					></tr
																																																				></tbody
																																																			>
																																																		</table></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>
																																									</td></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>

																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 20px 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			style="width: 100%;"
																																			cellspacing="0"
																																			cellpadding="0"
																																		>
																																			<tbody
																																				><tr
																																					><td
																																						><table
																																							style="width: 100%;"
																																							cellspacing="0"
																																							cellpadding="0"
																																						>
																																							<tbody
																																								><tr
																																									><td
																																										style="width: 22%; padding-right: 0px;"
																																										valign="top"
																																									>
																																										<table
																																											role="presentation"
																																											style="min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														class="stylingblock-content-wrapper camarker-inner"
																																														><table
																																															role="presentation"
																																															width="100%"
																																															cellspacing="0"
																																															cellpadding="0"
																																														>
																																															<tbody
																																																><tr
																																																>
																																																	<td
																																																		class="body-padding-mobile-left"
																																																		style="padding: 5px 0 0 0;"
																																																		align="right"
																																																		><img
																																																			data-assetid="26550"
																																																			src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/5/9f42fa0f-a073-471d-bcc7-c41b83086013.png"
																																																			alt="Data Rollover"
																																																			style="display: block; text-align: right; padding: 0px; height: 55px; width: 55px; border: 0px;"
																																																			width="55"
																																																			height="55"
																																																		/></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>
																																									</td><td
																																										style="width: 78%; padding-left: 0px;"
																																										valign="top"
																																									>
																																										<table
																																											role="presentation"
																																											style="min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														class="stylingblock-content-wrapper camarker-inner"
																																														><table
																																															style="padding: 0 valign: 'top';"
																																															align="left"
																																														>
																																															<tbody
																																																><tr
																																																>
																																																	<td
																																																		class="body-padding-mobile-right"
																																																		style="padding: 0 120px 0 0;"
																																																	>
																																																		<table
																																																		>
																																																			<tbody
																																																				><tr
																																																				>
																																																					<td
																																																						style="font-size: 20px; padding: 0 0 0 25px; mso-padding-alt: 5px 0 0 25px; color:#570066;"
																																																					>
																																																						Data
																																																						Rollover</td
																																																					></tr
																																																				><tr
																																																				>
																																																					<td
																																																						style="padding: 10px 0 0 25px; mso-padding-alt: 14px 0 0 25px;"
																																																					>
																																																						Roll
																																																						over
																																																						your
																																																						unused
																																																						data
																																																						to
																																																						use
																																																						within
																																																						your
																																																						next
																																																						recharge,
																																																						just
																																																						recharge
																																																						$20
																																																						-
																																																						$50
																																																						before
																																																						expiry.</td
																																																					></tr
																																																				></tbody
																																																			>
																																																		</table></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>
																																									</td></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>

																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 20px 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			style="width: 100%;"
																																			cellspacing="0"
																																			cellpadding="0"
																																		>
																																			<tbody
																																				><tr
																																					><td
																																						><table
																																							style="width: 100%;"
																																							cellspacing="0"
																																							cellpadding="0"
																																						>
																																							<tbody
																																								><tr
																																									><td
																																										style="width: 22%; padding-right: 0px;"
																																										valign="top"
																																									>
																																										<table
																																											role="presentation"
																																											style="min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														class="stylingblock-content-wrapper camarker-inner"
																																														><table
																																															role="presentation"
																																															width="100%"
																																															cellspacing="0"
																																															cellpadding="0"
																																														>
																																															<tbody
																																																><tr
																																																>
																																																	<td
																																																		class="body-padding-mobile-left"
																																																		style="padding: 5px 0 0 0;"
																																																		align="right"
																																																		><img
																																																			data-assetid="26565"
																																																			src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/5/cebb2eb8-3421-4b99-8ac5-3d249c2bd805.png"
																																																			alt="Telstra Plus"
																																																			style="display: block; text-align: right; padding: 0px; height: 55px; width: 55px; border: 0px;"
																																																			width="55"
																																																			height="55"
																																																		/></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>
																																									</td><td
																																										style="width: 78%; padding-left: 0px;"
																																										valign="top"
																																									>
																																										<table
																																											role="presentation"
																																											style="min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														class="stylingblock-content-wrapper camarker-inner"
																																														><table
																																															style="padding: 0 valign: 'top';"
																																															align="left"
																																														>
																																															<tbody
																																																><tr
																																																>
																																																	<td
																																																		class="body-padding-mobile-right"
																																																		style="padding: 0 120px 0 0;"
																																																	>
																																																		<table
																																																		>
																																																			<tbody
																																																				><tr
																																																				>
																																																					<td
																																																						style="font-size: 20px; padding: 0 0 0 25px; mso-padding-alt: 5px 0 0 25px; color:#570066;"
																																																					>
																																																						Be
																																																						Rewarded
																																																						with
																																																						Telstra
																																																						Plus</td
																																																					></tr
																																																				><tr
																																																				>
																																																					<td
																																																						style="padding: 10px 0 0 25px; mso-padding-alt: 14px 0 0 25px;"
																																																					>
																																																						Earn
																																																						points
																																																						towards
																																																						benefits,
																																																						like
																																																						discounted
																																																						movie
																																																						and
																																																						sports
																																																						tickets
																																																						by
																																																						joining
																																																						our
																																																						rewards
																																																						program.
																																																						Eligibility
																																																						criteria
																																																						apply.</td
																																																					></tr
																																																				></tbody
																																																			>
																																																		</table></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>
																																									</td></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>

																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table width="100%">
																																			<tbody
																																				><tr>
																																					<td
																																						class="body-padding-mobile"
																																						style="padding: 0 120px;"
																																					>
																																						<p>
																																							All for use in
																																							Australia.<br />
																																							<br />
																																							Want to know more about
																																							your plan's features and
																																							inclusions? Visit us online
																																							today.
																																						</p></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>

																														<table
																															role="presentation"
																															style="background-color: #FFEFF7; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 20px 0px 40px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			style="background-color: transparent; min-width: 100%;"
																																			width="100%"
																																			cellspacing="0"
																																			cellpadding="0"
																																			{border}
																																			align="center"
																																		>
																																			<tbody
																																				><tr>
																																					<td
																																						id="cta-mobile-left-padding"
																																						style="padding-left: 120px; mso-padding-alt: 0 0 0 117px;"
																																					>
																																						<table
																																							class="button-color-from-magenta"
																																							style="border: 1px solid #570066;"
																																							cellspacing="0"
																																							cellpadding="0"
																																							{border}
																																							bgcolor="#570066"
																																							align="left"
																																						>
																																							<tbody
																																								><tr>
																																									<td
																																										class="cta-mobile"
																																										style="border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px; background-color: #570066; text-align: center; padding: 11px 11px 11px 14px; text-decoration: none;font-weight: bold;"
																																										valign="middle"
																																										align="left"
																																									>
																																										<a
																																											data-linkto="other"
																																											href="https://click.messages.telstra.com/?qs=132d2c11df71aa9fc669384af9c93f3a3a13467382c2b2b6e0b45315cff518c0e86cb68ceb50e8f9a7f18df13d9aee44a6c510f6c90c43c3b93929f631038e16"
																																											style="color:#FFFFFF;text-decoration:none;font-size: 16px; text-align: left; font-weight: bold; display: block; background-color: #570066; border: 0px; border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px;"
																																											target="_blank"
																																											title="Find out more"
																																											>Find out more
																																											&nbsp;&nbsp;&nbsp;<span
																																												class="button-arrow-white"
																																												>&gt;</span
																																											></a
																																										></td
																																									></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>
																														<table
																															role="presentation"
																															style="background-color: transparent; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 40px 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			role="presentation"
																																			style="width: 100%;"
																																			cellspacing="0"
																																			cellpadding="0"
																																		>
																																			<tbody
																																				><tr
																																					><td
																																						><table
																																							role="presentation"
																																							style="width: 100%;"
																																							cellspacing="0"
																																							cellpadding="0"
																																						>
																																							<tbody
																																								><tr
																																									><td
																																										class="responsive-td"
																																										style="width: 100%;"
																																										valign="top"
																																									>
																																										<table
																																											role="presentation"
																																											style="background-color: transparent; min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														style="padding: 0px 0px 20px; "
																																														class="stylingblock-content-wrapper camarker-inner"
																																														><table
																																															style="background-color: transparent; min-width: 100%; "
																																															width="100%"
																																															cellspacing="0"
																																															cellpadding="0"
																																														>
																																															<tbody
																																																><tr
																																																>
																																																	<td
																																																		class="body-padding-mobile"
																																																		style="padding: 0px 120px;"
																																																	>
																																																		<table
																																																			style="width: 100%;"
																																																			cellspacing="0"
																																																			cellpadding="0"
																																																		>
																																																			<tbody
																																																				><tr
																																																				>
																																																					<td
																																																						style="width: 100%"
																																																						valign="top"
																																																						align="left"
																																																					>
																																																						<span
																																																							style="font-size: 20px; color: #570066; line-height: 24px;"
																																																							>Always
																																																							here
																																																							to
																																																							help.</span
																																																						></td
																																																					></tr
																																																				></tbody
																																																			>
																																																		</table></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>

																																										<table
																																											role="presentation"
																																											style="background-color: transparent; min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														style="padding: 0px; "
																																														class="stylingblock-content-wrapper camarker-inner"
																																														><table
																																															style="background-color: transparent; min-width: 100% border: 0;"
																																															width="100%"
																																															cellspacing="0"
																																															cellpadding="0"
																																														>
																																															<tbody
																																																><tr
																																																>
																																																	<td
																																																		class="body-padding-mobile"
																																																		style="padding: 0px 120px;"
																																																	>
																																																		<table
																																																			style="width: 100%;"
																																																			cellspacing="0"
																																																			cellpadding="0"
																																																		>
																																																			<tbody
																																																				><tr
																																																				>
																																																					<td
																																																						class="responsive-td pad-bottom-5"
																																																						style="width: 50%; padding-top: 3px; padding-right: 4px;"
																																																						valign="top"
																																																					>
																																																						<table
																																																							style="min-width: 100%;"
																																																							cellspacing="0"
																																																							cellpadding="0"
																																																						>
																																																							<tbody
																																																								><tr
																																																								>
																																																									<td
																																																									>
																																																										<table
																																																											style="width: 100%;"
																																																											cellspacing="0"
																																																											cellpadding="0"
																																																										>
																																																											<tbody
																																																												><tr
																																																												>
																																																													<td
																																																														style="width: 30px;"
																																																														width="30"
																																																														valign="top"
																																																													>
																																																														<table
																																																															style="background-color: transparent; min-width: 100%;"
																																																															cellspacing="0"
																																																															cellpadding="0"
																																																														>
																																																															<tbody
																																																																><tr
																																																																>
																																																																	<td
																																																																	>
																																																																		<table
																																																																			width="30"
																																																																			cellspacing="0"
																																																																			cellpadding="0"
																																																																		>
																																																																			<tbody
																																																																				><tr
																																																																				>
																																																																					<td
																																																																						align="left"
																																																																					>
																																																																						<a
																																																																							data-linkto="other"
																																																																							href="https://click.messages.telstra.com/?qs=132d2c11df71aa9f741986444b79a3c6b580639fdc2480e44c6e22ad33516c74e86aaa6ae4e23a21851f2c5bd45aeacf68636f814b2077a4f4a11697c51532e1"
																																																																							style="text-decoration: none;"
																																																																							target="_blank"
																																																																							title="Visit us online"
																																																																							><img
																																																																								alt="Visit us online"
																																																																								data-assetid="22497"
																																																																								src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/4/e2227b7c-652d-45a1-994f-be4a2dc5d925.png"
																																																																								style="display: block; text-align: left; height: 30px; width: 30px; padding: 0px; border: 0px;"
																																																																								width="30"
																																																																								height="30"
																																																																							/></a
																																																																						></td
																																																																					></tr
																																																																				></tbody
																																																																			>
																																																																		</table></td
																																																																	></tr
																																																																></tbody
																																																															>
																																																														</table></td
																																																													><td
																																																														style="width: 100%; padding-left: 0px;"
																																																														valign="top"
																																																													>
																																																														<table
																																																															style="background-color: transparent; min-width: 100%;"
																																																															width="100%"
																																																															cellspacing="0"
																																																															cellpadding="0"
																																																														>
																																																															<tbody
																																																																><tr
																																																																>
																																																																	<td
																																																																	>
																																																																		<table
																																																																		>
																																																																			<tbody
																																																																				><tr
																																																																				>
																																																																					<td
																																																																						style="font-size: 17px; padding: 2px 10px 0 17px; mso-padding-alt: 7px 10px 0 15px; color:#570066;"
																																																																					>
																																																																						<a
																																																																							data-linkto="other"
																																																																							href="https://click.messages.telstra.com/?qs=132d2c11df71aa9fb802f65d06a1c87918b1eaa82a22f54fe5c60c019d66666ce730e1a88dcb085e329b85a47e1a8beea93d794e1eae7ee77399577ab827f239"
																																																																							style="color:#570066;text-decoration:none;"
																																																																							title="Visit us online"
																																																																							>Visit
																																																																							us
																																																																							online</a
																																																																						></td
																																																																					></tr
																																																																				></tbody
																																																																			>
																																																																		</table></td
																																																																	></tr
																																																																></tbody
																																																															>
																																																														</table></td
																																																													></tr
																																																												></tbody
																																																											>
																																																										</table></td
																																																									></tr
																																																								></tbody
																																																							>
																																																						</table></td
																																																					>
																																																					<td
																																																						class="responsive-td"
																																																						style="width: 50%; padding-top: 3px; padding-right: 4px;"
																																																						valign="top"
																																																					>
																																																						<table
																																																							style="min-width: 100%;"
																																																							width="100%"
																																																							cellspacing="0"
																																																							cellpadding="0"
																																																						>
																																																							<tbody
																																																								><tr
																																																								>
																																																									<td
																																																									>
																																																										<table
																																																											style="width: 100%;"
																																																											cellspacing="0"
																																																											cellpadding="0"
																																																										>
																																																											<tbody
																																																												><tr
																																																												>
																																																													<td
																																																														style="width: 30px;"
																																																														width="30"
																																																														valign="top"
																																																													>
																																																														<table
																																																															style="background-color: transparent; min-width: 100%;"
																																																															cellspacing="0"
																																																															cellpadding="0"
																																																														>
																																																															<tbody
																																																																><tr
																																																																>
																																																																	<td
																																																																	>
																																																																		<table
																																																																			width="30"
																																																																			cellspacing="0"
																																																																			cellpadding="0"
																																																																		>
																																																																			<tbody
																																																																				><tr
																																																																				>
																																																																					<td
																																																																						align="left"
																																																																					>
																																																																						<a
																																																																							data-linkto="other"
																																																																							href="https://click.messages.telstra.com/?qs=132d2c11df71aa9f7ee2cd152891f68a5f4441361d743a11e6156931b8ecab2049bc6bb4f9b42914c3ab0874db2d1244dd8f1cf567ad8fcba62cfd2435849fd5"
																																																																							style="text-decoration: none;"
																																																																							target="_blank"
																																																																							title="My Telstra app"
																																																																							><img
																																																																								alt="My Telstra App"
																																																																								data-assetid="21570"
																																																																								src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/3/4932cca6-f419-45a2-8982-ce99b90e01d4.png"
																																																																								style="display: block; text-align: left; height: 30px; width: 30px; padding: 0px; border: 0px;"
																																																																								width="30"
																																																																								height="30"
																																																																							/></a
																																																																						></td
																																																																					></tr
																																																																				></tbody
																																																																			>
																																																																		</table></td
																																																																	></tr
																																																																></tbody
																																																															>
																																																														</table></td
																																																													><td
																																																														style="width: 100%; padding-left: 0px;"
																																																														valign="top"
																																																													>
																																																														<table
																																																															style="background-color: transparent; min-width: 100%;"
																																																															width="100%"
																																																															cellspacing="0"
																																																															cellpadding="0"
																																																														>
																																																															<tbody
																																																																><tr
																																																																>
																																																																	<td
																																																																	>
																																																																		<table
																																																																		>
																																																																			<tbody
																																																																				><tr
																																																																				>
																																																																					<td
																																																																						style="font-size: 17px; padding: 2px 0 0 17px; mso-padding-alt: 7px 10px 0 15px; color:#570066;"
																																																																					>
																																																																						<a
																																																																							data-linkto="other"
																																																																							href="https://click.messages.telstra.com/?qs=132d2c11df71aa9fe2daee68a49c083180c443db7f360549f6330e0ae2e3b1ecc4c221d8ffb01ce100b69d14b25a4feebbdc5d4395128cc8830f72a3971d4583"
																																																																							style="color:#570066;text-decoration:none;"
																																																																							title="My Telstra app"
																																																																							>My
																																																																							Telstra
																																																																							app</a
																																																																						></td
																																																																					></tr
																																																																				></tbody
																																																																			>
																																																																		</table></td
																																																																	></tr
																																																																></tbody
																																																															>
																																																														</table></td
																																																													></tr
																																																												></tbody
																																																											>
																																																										</table></td
																																																									></tr
																																																								></tbody
																																																							>
																																																						</table></td
																																																					></tr
																																																				></tbody
																																																			>
																																																		</table></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>
																																									</td></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>
																													</td>
																												</tr>
																											</tbody>
																										</table>
																									</td>
																								</tr>
																							</tbody>
																						</table>
																					</td>
																				</tr>
                                                                                <tr style="background-color:#D9D9D9">
																					<td align="center" class="header" valign="top">
																						<table
																							align="left"
																							{border}
																							cellpadding="0"
																							cellspacing="0"
																							width="100%"
																						>
																							<tbody>
																								<tr>
																									<td align="left" valign="top">
																										<table
																											{border}
																											cellpadding="0"
																											cellspacing="0"
																											style="width:100%"
																										>
																											<tbody>
																												<tr>
																													<td
																														class="responsive-td"
																														valign="top"
																														style="width: 100%; text-decoration:none;"
																													>
																														<table
																															role="presentation"
																															style="min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			width="100%"
																																			cellspacing="0"
																																			cellpadding="0"
																																			{border}
																																			align="center"
																																		>
																																			<tbody
																																				><tr>
																																					<td
																																						style="background-color: '#570066';"
																																						valign="middle"
																																						align="center"
																																					>
																																						<table
																																							class="container"
																																							style="width:800px;"
																																							width="800"
																																							cellspacing="0"
																																							cellpadding="0"
																																							{border}
																																							align="center"
																																						>
																																							<tbody
																																								><tr>
																																									<td
																																										style="width:800px; height: 66px; background:'https://image.messages.telstra.com/lib/fe32157075640574741d78/m/1/5ed4b421-d83a-4c6a-aac6-b6de8b94dcbd.jpg' background-color:#570066; background-repeat:no-repeat; background-position: 50% 50%; background-size: 100% 100%; vertical-align: middle !important;"
																																										width="800"
																																										valign="middle"
																																										height="66"
																																										align="center"
																																									>
                                                                                                                                                                    <div
																																											style="background-size: 0%; background-position: right top;"
																																										>
																																											<div
																																												style="align: center"
																																											>
																																												<table
																																													class="container"
																																													style="width:800px; height:66px;"
																																													width="800"
																																													cellspacing="0"
																																													cellpadding="0"
																																													{border}
																																													align="center"
																																												>
																																													<tbody
																																														><tr>
																																															<td
																																																valign="middle"
																																																align="center"
																																															>
																																																<table
																																																	style="width:220px;"
																																																	width="220"
																																																	cellspacing="0"
																																																	cellpadding="0"
																																																	{border}
																																																	align="center"
																																																>
																																																	<tbody
																																																		><tr
																																																		>
																																																			<td
																																																				style="padding: 0;"
																																																				valign="middle"
																																																				align="center"
																																																			>
																																																				<table
																																																					style="border: 0;"
																																																					cellspacing="0"
																																																					cellpadding="0"
																																																				>
																																																					<tbody
																																																						><tr
																																																						>
																																																							<td
																																																								valign="middle"
																																																								align="center"
																																																							>
																																																								<table
																																																									style="width:23px border: 0;"
																																																									width="23"
																																																									cellspacing="0"
																																																									cellpadding="0"
																																																								>
																																																									<tbody
																																																										><tr
																																																										>
																																																											<td
																																																												valign="middle"
																																																												align="center"
																																																											>
																																																												<a
																																																													data-linkto="other"
																																																													href="https://click.messages.telstra.com/?qs=132d2c11df71aa9f92003bab0f954bf6b0d1e1c23876c1bd7baa122a12f5186d0bee35b3adbdceb9a75a4a8b31bf985a1b2f8867d1b038b7a93f91380c23ee27"
																																																													style="text-decoration: none;"
																																																													target="_blank"
																																																													title="Facebook"
																																																													><img
																																																														alt="f"
																																																														src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/1/e5b404cb-60df-43fd-a509-8de132a9a5e1.png"
																																																														style="display: block; padding: 0px; text-align: center; height: 22px; width: 23px;"
																																																														width="23"
																																																														height="22"
																																																													/></a
																																																												></td
																																																											></tr
																																																										></tbody
																																																									>
																																																								</table></td
																																																							></tr
																																																						></tbody
																																																					>
																																																				</table></td
																																																			><td
																																																				style="padding: 0;"
																																																				valign="middle"
																																																				align="center"
																																																			>
																																																				<table
																																																					cellspacing="0"
																																																					cellpadding="0"
																																																					style="border: 0;"
																																																				>
																																																					<tbody
																																																						><tr
																																																						>
																																																							<td
																																																								valign="middle"
																																																								align="center"
																																																							>
																																																								<table
																																																									style="width:23px border: 0;"
																																																									width="23"
																																																									cellspacing="0"
																																																									cellpadding="0"
																																																								>
																																																									<tbody
																																																										><tr
																																																										>
																																																											<td
																																																												valign="middle"
																																																												align="center"
																																																											>
																																																												<a
																																																													data-linkto="other"
																																																													href="https://click.messages.telstra.com/?qs=132d2c11df71aa9fdacf88cb268f878b3569b3d262cf8a2dfdb2670a809177a260d6e7464e3295540c49073fbbd5504c949079a6428f64472c332e54a86e2651"
																																																													style="text-decoration: none;"
																																																													target="_blank"
																																																													title="LinkedIn"
																																																													><img
																																																														alt="in"
																																																														src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/1/814af157-4abc-4792-8171-4716570337ba.png"
																																																														style="display: block; padding: 0px; text-align: center; height: 22px; width: 23px;"
																																																														width="23"
																																																														height="22"
																																																													/></a
																																																												></td
																																																											></tr
																																																										></tbody
																																																									>
																																																								</table></td
																																																							></tr
																																																						></tbody
																																																					>
																																																				</table></td
																																																			><td
																																																				style="padding: 0;"
																																																				valign="middle"
																																																				align="center"
																																																			>
																																																				<table
																																																					cellspacing="0"
																																																					cellpadding="0"
																																																					style="border: 0;"
																																																				>
																																																					<tbody
																																																						><tr
																																																						>
																																																							<td
																																																								valign="middle"
																																																								align="center"
																																																							>
																																																								<table
																																																									style="width:23px border: 0;"
																																																									width="23"
																																																									cellspacing="0"
																																																									cellpadding="0"
																																																								>
																																																									<tbody
																																																										><tr
																																																										>
																																																											<td
																																																												valign="middle"
																																																												align="center"
																																																											>
																																																												<a
																																																													data-linkto="other"
																																																													href="https://click.messages.telstra.com/?qs=8c01e8038ac8cffb567e12fa09713c2e679e9382ee4929e48fc130bc132dca1d463ef9f9b335ffafb537f128480406d71e2e4d2d82598e3784755a16753e586b"
																																																													style="text-decoration: none;"
																																																													target="_blank"
																																																													title="Twitter"
																																																													><img
																																																														alt="t"
																																																														src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/1/426d8e89-6afc-4618-952d-1824d0a6d13a.png"
																																																														style="display: block; padding: 0px; text-align: center; height: 22px; width: 23px;"
																																																														width="23"
																																																														height="22"
																																																													/></a
																																																												></td
																																																											></tr
																																																										></tbody
																																																									>
																																																								</table></td
																																																							></tr
																																																						></tbody
																																																					>
																																																				</table></td
																																																			></tr
																																																		></tbody
																																																	>
																																																</table></td
																																															></tr
																																														></tbody
																																													>
																																												</table>
																																											</div>
																																										</div>
                                                                                                                                                                        </td
																																									></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>

																														<table
																															role="presentation"
																															style="background-color: #D9D9D9; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr>
																																	<td
																																		style="padding: 20px 0px 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			width="100%"
																																			cellspacing="0"
																																			cellpadding="0"
																																			{border}
																																			align="center"
																																		>
																																			<tbody
																																				><tr>
																																					<td
																																						valign="middle"
																																						align="center"
																																					>
																																						<table
																																							class="container"
																																							style="valign:'middle'"
																																							width="560"
																																							cellspacing="0"
																																							cellpadding="0"
																																							{border}
																																							align="center"
																																						>
																																							<tbody
																																								><tr>
																																									<td
																																										class="align-center footer-text table-block body-padding-mobile"
																																										style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height: 20px; color:#000000;"
																																										valign="middle"
																																										align="left"
																																									>
																																										<span
																																											class="logo footernav-margin"
																																											style="border-top: 1px solid #000000; display:none;"
																																											><span
																																												class="mobile-hidden"
																																												>&nbsp;</span
																																											></span
																																										>
																																										<a
																																											data-linkto="other"
																																											href="https://click.messages.telstra.com/?qs=8c01e8038ac8cffb877be35f4ddfad06bfbe90552eeea4e97d9d6220d0cba2999867d2deb464bea9e42b4a02b52a1bbe01811fc04bd86623d9e0d2ee09456e32"
																																											style="color:#000000;text-decoration:none;"
																																											target="_blank"
																																											title="Contact Us"
																																											>Contact Us</a
																																										>
																																										<span
																																											class="mobile-hidden"
																																											style="color: #000000;"
																																											>&nbsp;|&nbsp;</span
																																										>
																																										<span
																																											class="logo footernav-margin"
																																											style="border-top: 1px solid #000000; display:none;"
																																											><span
																																												class="mobile-hidden"
																																												>&nbsp;</span
																																											></span
																																										>
																																										<a
																																											data-linkto="other"
																																											href="https://click.messages.telstra.com/?qs=8c01e8038ac8cffbc0e498364c836ee9162334403417cd7ca70e95fb96c4084b8c671dbbcb8a08eed775c2ff9b0a724e7d8a6787331883ab233f41d261747629"
																																											style="color:#000000;text-decoration:none;"
																																											target="_blank"
																																											title="Privacy"
																																											>Privacy</a
																																										>
																																										<span
																																											class="mobile-hidden"
																																											style="color: #000000;"
																																											>&nbsp;|&nbsp;</span
																																										>
																																										<span
																																											class="logo footernav-margin"
																																											style="border-top: 1px solid #000000; display:none;"
																																											><span
																																												class="mobile-hidden"
																																												>&nbsp;</span
																																											></span
																																										>
																																										<a
																																											data-linkto="other"
																																											href="https://click.messages.telstra.com/?qs=8c01e8038ac8cffbd998fbfbf09d8d980506664255c2bd6bb439b3f80a818d4eb87e34cfd1dfba34f8fe3b8916d04c62f9f03bad5329e758a3000f08dad7a78f"
																																											style="color:#000000;text-decoration:none;"
																																											target="_blank"
																																											title="Our Customer Terms"
																																											>Our Customer
																																											Terms</a
																																										>
																																										<span
																																											class="mobile-hidden"
																																											style="color: #000000;"
																																											>&nbsp;|&nbsp;</span
																																										>
																																										<span
																																											class="logo footernav-margin"
																																											style="border-top: 1px solid #000000; display:none;"
																																											><span
																																												class="mobile-hidden"
																																												>&nbsp;</span
																																											></span
																																										>
																																										<a
																																											data-linkto="https://"
																																											href="https://click.messages.telstra.com/?qs=8c01e8038ac8cffb01e33e1107d6434b1da389e5b66e9374e204ce7463cddbe49bb1b00c6a4a7c8f1adf798ca81dc26a6c7ef71b3adbd3c52b72e5e55332da44"
																																											style="color:#000000; text-decoration:none;"
																																											target="_blank"
																																											title="Unsubscribe"
																																											>Unsubscribe</a
																																										>
																																										<span
																																											class="logo footernav-margin mobile-hidden"
																																											style="border-bottom: 1px solid #000000; display:none;"
																																											><span
																																												class="mobile-hidden"
																																												>&nbsp;</span
																																											></span
																																										></td
																																									></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>
																														<table
																															role="presentation"
																															style="background-color: #D9D9D9; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 20px 0px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table
																																			style="width: 100%;"
																																			cellspacing="0"
																																			cellpadding="0"
																																		>
																																			<tbody
																																				><tr
																																					><td
																																						><table
																																							style="width: 100%;"
																																							cellspacing="0"
																																							cellpadding="0"
																																						>
																																							<tbody
																																								><tr
																																									><td
																																										style="width: 22%; padding-right: 3.5px;"
																																										valign="top"
																																									>
																																										<table
																																											role="presentation"
																																											style="min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														class="stylingblock-content-wrapper camarker-inner"
																																														><table
																																															width="100%"
																																															cellspacing="0"
																																															cellpadding="0"
																																														>
																																															<tbody
																																																><tr
																																																>
																																																	<td
																																																		class="body-padding-mobile-left"
																																																		style="padding-left: 120px; padding-top: 13px;"
																																																		align="left"
																																																		><img
																																																			data-assetid="13677"
																																																			src="https://image.messages.telstra.com/lib/fe32157075640574741d78/m/1/dc74eae7-0a43-4e0a-8c21-74a9d2508215.gif"
																																																			alt=" "
																																																			style="display: block; padding: 0px; text-align: left; height: 32px; width: 32px; border: 0px;"
																																																			width="32"
																																																			height="32"
																																																		/></td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>
																																									</td><td
																																										style="width: 78%; padding-left: 3.5px;"
																																										valign="top"
																																									>
																																										<table
																																											role="presentation"
																																											style="min-width: 100%; "
																																											class="stylingblock-content-wrapper"
																																											width="100%"
																																											cellspacing="0"
																																											cellpadding="0"
																																										>
																																											<tbody
																																												><tr
																																													><td
																																														class="stylingblock-content-wrapper camarker-inner"
																																														><table>
																																															<tbody
																																																><tr
																																																>
																																																	<td
																																																		class="body-padding-mobile-right mobile-text"
																																																		style="padding: 0 125px 0 0; height: 50px; font-size:15px; line-height: 20px; font-family:arial,helvetica,sans-serif;"
																																																	>
																																																		You've
																																																		received
																																																		this
																																																		email
																																																		because
																																																		you
																																																		are
																																																		a
																																																		Telstra
																																																		customer
																																																		and
																																																		have
																																																		products
																																																		and/or
																																																		services
																																																		affected
																																																		by
																																																		this
																																																		message.</td
																																																	></tr
																																																></tbody
																																															>
																																														</table></td
																																													></tr
																																												></tbody
																																											>
																																										</table>
																																									</td></tr
																																								></tbody
																																							>
																																						</table></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>
																														<table
																															role="presentation"
																															style="background-color: #D9D9D9; min-width: 100%; "
																															class="stylingblock-content-wrapper"
																															width="100%"
																															cellspacing="0"
																															cellpadding="0"
																														>
																															<tbody
																																><tr
																																	><td
																																		style="padding: 0px 0px 20px; "
																																		class="stylingblock-content-wrapper camarker-inner"
																																		><table>
																																			<tbody
																																				><tr>
																																					<td
																																						class="body-padding-mobile"
																																						style="padding: 0 120px"
																																					>
																																						<p
																																							style="font-size:12px; line-height: 16px; font-family:arial,helvetica,sans-serif; mso-margin-bottom-alt: 0; margin-bottom: 0;"
																																						>
																																							<b
																																								>THINGS YOU NEED TO
																																								KNOW:</b
																																							>
																																							All for use in Australia.
																																							Roll over unused data when
																																							you recharge $20 - $50.
																																							Any unused data will then
																																							expire at the end of the
																																							next recharge period.
																																							<b>Telstra Plus:</b> Must
																																							be 18+ with an active service.
																																							Points are earned on payment
																																							for services or pre-paid
																																							recharge (excluding outright
																																							purchases, refunds, credits
																																							&amp; late payment fees).
																																							Points expire 3 years from
																																							earning. Marketing opt-in
																																							required (preferences can
																																							be changed). Excludes Enterprise
																																							and Corporate accounts.
																																						</p></td
																																					></tr
																																				></tbody
																																			>
																																		</table></td
																																	></tr
																																></tbody
																															>
																														</table>
																													</td>
																												</tr>
																											</tbody>
																										</table>
																									</td>
																								</tr>
																							</tbody>
																						</table>
																					</td>
																				</tr>
																			</tbody>
																		</table>
																	</td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table> -->
									</td>
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
