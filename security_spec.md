# SehatYaab Security Specification (TDD)

## 1. Data Invariants
- A `BloodRequest` must have a valid `requesterId` that matches the authenticated user.
- A `User` profile can only be created with the user's own `uid`.
- `HealthLogs` are strictly private to the `userId` owner.
- `PharmacyStock` can only be updated by users with a `pharmacy` role associated with that pharmacy.
- `BloodGroup` fields must be one of the 8 standard types.

## 2. The "Dirty Dozen" Payloads (Denial Tests)
1. **Identity Spoofing**: Creating a `User` doc with another user's `uid`.
2. **Privilege Escalation**: Setting `role: 'admin'` during self-registration.
3. **Orphaned Request**: Creating a `BloodRequest` with a fake hospital ID or without a `requesterId`.
4. **State Shortcutting**: Updating a `BloodRequest` status directly to `fulfilled` by a non-owner.
5. **PII Leak**: Querying all `User` emails without a specific `uid` filter.
6. **Immutable Tampering**: Changing `createdAt` timestamp on update.
7. **Resource Poisoning**: Injecting a 2MB string into `patientName`.
8. **Shadow Fields**: Adding `isVerified: true` to a medicine report via client SDK.
9. **Role Bypass**: Non-pharmacy user updating medicine stock.
10. **Unauthorized Health Access**: Reading another user's `HealthLog`.
11. **Donor Fatigue Attack**: Creating 100 fake blood requests in 1 minute.
12. **Id Poisoning**: Using `../../system/internal` as a document ID.

## 3. Test Runner (Draft)
The `firestore.rules.test.ts` will verify these payloads return `PERMISSION_DENIED`.
