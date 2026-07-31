# Azure OIDC + Managed Identity Checklist (GitHub Actions)

Use this checklist when Azure login fails in GitHub Actions for this repo.

## 1. Pick one deployment identity

Use one identity only for pipeline auth.

- Recommended: User-assigned managed identity (UAMI)

## 2. Configure federated credential on the same identity

Portal path:

- Azure portal -> Managed Identities -> <your UAMI> -> Federated credentials -> Add credential

Set:

- Issuer: https://token.actions.githubusercontent.com
- Audience: api://AzureADTokenExchange
- Subject: exact string from pipeline log

Example subject patterns:

- repo:Oyen-o/Munchers:ref:refs/heads/main
- repo:Oyen-o@87141664/Munchers@1305261969:ref:refs/heads/main

Note: Subject matching is exact and case-sensitive.

## 3. Set GitHub secrets from the same identity

In repo secrets, ensure:

- AZUREAPPSERVICE*CLIENTID*... = UAMI Client ID
- AZUREAPPSERVICE*TENANTID*... = Tenant ID where UAMI exists
- AZUREAPPSERVICE*SUBSCRIPTIONID*... = target subscription ID

Do not use:

- Principal ID
- Object ID
- Web App runtime identity Client ID (unless intentionally used for deployment)

## 4. Grant RBAC to the same identity

Portal path:

- Subscription (or Resource Group) -> Access control (IAM) -> Add role assignment

Set:

- Role: Contributor (or least privilege needed)
- Assign access to: Managed identity
- Select: the same UAMI used in step 3

## 5. Quick error map

- AADSTS700016
  - Client ID not found in tenant
  - Usually wrong client ID/tenant pair

- AADSTS700213
  - No matching federated identity record
  - Subject/issuer/audience mismatch

- No subscriptions found
  - Login succeeded, but identity has no RBAC access to subscription scope

## 6. Final pre-run verification (60 seconds)

- Client ID in workflow secret == UAMI Client ID
- Federated credential exists on that same UAMI
- Subject equals the exact value from latest workflow log
- Tenant ID secret matches UAMI tenant
- Subscription ID secret matches target subscription
- UAMI has IAM role assignment on that scope

## 7. Workflow reminder

In this repo, the Azure login step is in:

- .github/workflows/main_munchers.yml

Ensure the secret values referenced there are the corrected ones.
