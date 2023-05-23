pub mod security {
    use solana_security_txt::security_txt;

    #[cfg(not(feature = "no-entrypoint"))]
    security_txt! {
        // Required fields
        name: "Mln-DID",
        project_url: "https://github.com/identity-com/mln-did",
        contacts: "email: contact@identity.org",
        policy: "https://docs.identity.com/docs/mln-did/#policies",
        encryption: "https://docs.identity.com/pgp.txt",
        preferred_languages: "en",
        source_code: "https://github.com/identity-com/mln-did.git"
    }
}
