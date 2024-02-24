<script lang="ts">
	import { Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from 'svelty-email';

	const fontFamily =
		'-apple-system,BlinkMacSystemFont,"Segoe UI","Segoe UI Emoji", "Segoe UI Symbol",Roboto,Oxygen-Sans,' +
		'Ubuntu,Cantarell,"Helvetica Neue",sans-serif,Poppins, Inter, ui-sans-serif, system-ui, Arial,' +
		' "Noto Sans", "Apple Color Emoji", "Noto Color Emoji"';

	const main = {
		backgroundColor: '#ffedd5'
	};

	const container = {
		margin: '0 auto',
		padding: '20px 0 48px',
		backgroundColor: '#ffedd5'
	};

	const logo = {
		margin: '0 auto'
	};

	const paragraph = {
		fontFamily,
		fontSize: '16px',
		lineHeight: '26px',
		padding: '0 20px 0 20px'
	};

	const btnContainer = {
		textAlign: 'center' as const
	};

	const button = {
		fontFamily,
		backgroundColor: '#5F51E8',
		borderRadius: '3px',
		color: '#fff',
		fontSize: '16px',
		textDecoration: 'none',
		textAlign: 'center' as const,
		display: 'block'
	};

	const hr = {
		borderColor: '#cccccc',
		margin: '20px 0'
	};

	const footer = {
		fontFamily,
		color: '#8898aa',
		fontSize: '12px'
	};
</script>

<Html lang="en">
	<Head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Your RFS Planning Information</title>
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
	<Preview preview="Here is you RFS Plan" />
	<Section style={main}>
		<Container style={container}>
			<Img
				src="
				https://github.com/BCYCAData/soc-dev/blob/master/src/components/SOCLogo_half.png?raw=true"
				alt="Strengthen Our Community project logo"
				style={logo}
				width="128"
				height="128"
			/>
			<Text style={paragraph}>Here is the RFS Plan information you requested</Text>
			<Text style={paragraph}>Lots of stuff here</Text>
			<Section style={btnContainer} />
			<Text style={paragraph}>Happy planning!</Text>
			<Hr style={hr} />
			<Text style={footer}>The Strengthen Our Community Projetc</Text>
		</Container>
	</Section>
</Html>
