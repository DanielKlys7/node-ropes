export const verificationEmailGenerator = (id: string, code: string) => ({
    subject: 'Here is you account verification link!',
    text: `https://somelink.com/auth/accVerification/${id}/${code}`,
});
