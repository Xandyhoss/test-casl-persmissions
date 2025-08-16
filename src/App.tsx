import {
  getSubject,
  getUserPermissionsUpdate,
} from "./permissions/permissionsUpgrade";

function App() {
  const userPermissions = getUserPermissionsUpdate({
    id: 9,
    userType: "ADMIN",
    adminOrg: true,
  });

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        Can create projects:{" "}
        {userPermissions.can(
          "create",
          getSubject("Project", { adminOrg: true, authorId: 9 })
        )
          ? "True"
          : "False"}
      </div>
      <div>
        Can export billing:{" "}
        {userPermissions.can("export", getSubject("Billing", { authorId: 5 }))
          ? "True"
          : "False"}
      </div>
    </div>
  );
}

export default App;
