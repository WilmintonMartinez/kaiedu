import type { Metadata } from "next";
import { CreateUserForm } from "../create-user-form";
import shell from "../../shell.module.css";

export const metadata: Metadata = {
  title: "Nuevo usuario — KaiEdu",
};

export const dynamic = "force-dynamic";

export default function NuevoUsuarioPage() {
  return (
    <>
      <div className={shell.pageHeader}>
        <div>
          <h1>Registrar usuario</h1>
          <p>Crea una cuenta con rol para acceder al sistema.</p>
        </div>
      </div>

      <CreateUserForm />
    </>
  );
}
