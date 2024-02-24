<script lang="ts">
	import type { PostgRestErrorEmailSubject } from '$lib/server/email/nodemailer';
	import type { PostgrestError } from '@supabase/supabase-js';
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
	} from 'svelty-email';

	enum TitleType {
		databaseError = 'SOC Database Error Report',
		information = 'SOC Data Information'
	}

	export let titleType: TitleType = TitleType.databaseError;
	export let subjectText: PostgRestErrorEmailSubject;
	export let postgRestError: PostgrestError = {
		message: '',
		details: '',
		hint: '',
		code: ''
	};

	console.log('Email Subject Text', subjectText);
	const previewText = titleType;

	const fontFamily =
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

	const main = {
		backgroundColor: '#ffedd5'
	};

	const container = {
		margin: '0 auto',
		padding: '20px 0 48px',
		width: '580px'
	};

	const leader = {
		'max-width': '37.5em',
		margin: '0 auto',
		padding: '10px',
		width: '580px',
		display: 'flex',
		'background-color': '#f97316',
		'align-items': 'center'
	};

	const image = { 'margin-right': '10px' };

	const heading = {
		fontFamily,
		fontSize: '32px',
		lineHeight: '1.3',
		fontWeight: '700',
		'padding-left': '10px',
		color: '#f9f9f4'
	};

	const paragraph = {
		fontFamily,
		fontSize: '18px',
		lineHeight: '1.4',
		color: '#484848'
	};

	const subject = {
		fontFamily,
		fontSize: '20px',
		lineHeight: '1.4',
		color: '#484848',
		padding: '4px',
		backgroundColor: '#fecaca',
		borderRadius: '4px'
	};

	const button = {
		fontFamily,
		backgroundColor: '#ff5a5f',
		borderRadius: '3px',
		color: '#fff',
		fontSize: '18px',
		textDecoration: 'none',
		textAlign: 'center' as const,
		display: 'block',
		width: '100%'
	};

	const link = {
		...paragraph,
		color: '#ff5a5f',
		display: 'block'
	};

	const reportLink = {
		fontFamily,
		fontSize: '14px',
		color: '#9ca299',
		textDecoration: 'underline'
	};

	const hr = {
		borderColor: '#cccccc',
		margin: '20px 0'
	};

	const footer = {
		fontFamily,
		color: '#9ca299',
		fontSize: '14px',
		marginBottom: '10px'
	};
</script>

<Html>
	<Head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>{titleType}</title>
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
			<Text style={leader}>
				<Img
					src="https://github.com/BCYCAData/soc-dev/blob/master/src/components/SOCLogo_half.png?raw=true"
					style={image}
					width="45"
					height="45"
					alt="Strengthen Our Community"
				/>
				<Text style={heading}>Strengthen Our Community</Text>
			</Text>
			<Text style={subject}
				>{subjectText.type} <br />{subjectText.user} <br />{subjectText.time}
			</Text>
			<Text style={{ ...paragraph, fontWeight: '700' }}>
				Message: {postgRestError.message}
			</Text>
			<Text style={paragraph}>
				Details: {postgRestError.details}
			</Text>
			<Text style={paragraph}>
				Hint: {postgRestError.hint}
			</Text>
			<Text style={paragraph}>
				Code: {postgRestError.code}
			</Text>
		</Container>
	</Section>
</Html>
