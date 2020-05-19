import * as AWS from 'aws-sdk';

export class AuthService {
    private readonly domain = 'japanese-domain.auth.eu-central-1.amazoncognito.com';
    private readonly clientId = '2c67ijqv3lc5r7pq46oou0ckg5';
    private readonly redirectUri = `${process.env.VUE_APP_OAUTH_REDIRECT}/login/oauth2`;

    login() {
        const url = `https://${this.domain}/login?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=token&scope=email+openid`;
        window.location.href = url;
    }

    async handleAuthCallback(url: string) {
        const index = url.indexOf('id_token');
        const queryParams = url.substring(index);
        const urlParams = new URLSearchParams(queryParams);

        const token = urlParams.get('id_token') as string;

        const cred = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'eu-central-1:8a5af73f-4932-492c-b9ff-573e50aa3f79',
            Logins: {
                'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_M5wU72Qzo': token,
            },
        });
        await cred.getPromise();

        AWS.config.credentials = cred;
    }

    isAuthenticated(): boolean {
        return !this.getCredentials().expired;
    }

    getCredentials(): AWS.CognitoIdentityCredentials {
        return AWS.config.credentials as AWS.CognitoIdentityCredentials;
    }
}

export const auth = new AuthService();
