/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserCreateDTO } from "../../models/user";
import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { createUser } from "../../services/user-service";
import axios from "axios";

export default function NovoUsuario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserCreateDTO>({
    nome: "",
    cpf: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // arrow functions
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createUser(formData);
      setSuccess("Usuário criado com sucesso!");
      // Limpa o formulário após o sucesso
      setFormData({
        nome: "",
        cpf: "",
        email: "",
      });
      setTimeout(() => navigate("/"), 4000);
    } catch (error: unknown) {
      let msg = "Erro ao criar usuário! Tente novamente";
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const errorMessages = error.response.data.errors
            .map((e: any) => e.message)
            .join(", ");
          msg = `Dados inválidos: ${errorMessages}. Tente novamente`;
        } else {
          msg = error.response.data.error || msg;
        }
      }
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2, p: 4 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography>Cadastro de Usuário</Typography>

      <Box
        component="form"
        noValidate
        sx={{ mt: 2 }}
        onSubmit={handleSubmit} //chama a função
      >
        <TextField
          id="nome"
          name="nome"
          label="Nome do Usuário"
          value={formData.nome}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          autoFocus
          sx={{ mb: 2 }}
        />
        <TextField
          id="cpf"
          name="cpf"
          label="CPF do Usuário"
          value={formData.cpf}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          id="email"
          name="email"
          label="E-mail do Usuário"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/")}
          >
            Cancelar
          </Button>
          <Button variant="outlined" color="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
                <CircularProgress size={24} color="inherit" />
            ) : (
                "Salvar"
            )}
           
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
