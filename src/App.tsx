import {
  getSubject,
  getUserPermissionsUpdate,
} from "./permissions/permissionsUpgrade";

function App() {
  const userPermissions = getUserPermissionsUpdate({
    id: 5,
    userType: "USER",
    adminOrg: false,
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
        {userPermissions.can("create", "Projects") ? "True" : "False"}
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
