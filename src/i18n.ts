import type { LanguageCodeType } from '$lib/interface';
import { languageStore } from '$lib/stores/languajeStore';
import i18next from 'i18next';
import { createI18nStore } from 'svelte-i18next';
import { get } from 'svelte/store';

// Obtén el idioma guardado en localStorage o usa el predeterminado
const savedLanguage: LanguageCodeType = get(languageStore) || 'en';

i18next.init({
	lng: savedLanguage, // Idioma por defecto
	resources: {
		en: {
			translation: {
				auth: {
					tittleSignUp: 'Register Account',
					tittleSignIn: 'Sign in to your account',
					notMember: "Don't have an account yet?",
					goSignUp: 'Register here.',
					personalInfo: 'Personal Information',
					nickname: 'Nickname',
					emailAddress: 'Email Address',
					password: 'Password',
					repeatPassword: 'Repeat Password',
					location: 'Location',
					chooseAvatar: 'Choose your avatar',
					btnSignUp: 'Sign up',
					btnSignIn: 'Sign in',
					nicknamePlaceHolder: 'Choose your username',
					emailAddressPlaceHolder: 'You@username.com',
					passwordPlaceHolder: 'Password',
					repeatPasswordPlaceHolder: 'Repeat Password',
					hasAccountLabel: 'Do you already have an account?',
					tittleRessetPassword: 'Reset password',
					btnRessetPassword: 'Send',
					goRessetPassword: 'Forgot password?',
					textRessetPasswordInstructions:
						"Enter your email address and we'll send you instructions to reset your password.",
					rememberPassword: 'Remember your password?',
					goBack: 'Go back'
				},
				oauth: {
					title: 'Botsi GPT wants to connect to your account',
					text: 'Botsi GPT from ChatGPT wants to be able to access your data and perform operations.',
					question: 'Allow access to Botsi GPT?',
					buttonText: 'Authorize'
				},
				settings: {
					tittle: 'Settings',
					description: 'Description',
					systemPrompts: {
						title: 'System Prompts',
						description: 'Description'
					},
					users: {
						title: 'Users',
						description: 'Description'
					},
					agents: {
						title: 'API Keys',
						description: 'Description'
					},
					statistics: {
						title: 'Statistics',
						description: 'Description'
					},
					apiKeys: {
						title: 'API Keys',
						description: 'Description'
					}
				},
				buttons: {
					save: 'Save',
					cancel: 'Cancel',
					delete: 'Delete',
					edit: 'Edit',
					view: 'View',
					update: 'Update',
					previous: 'Previous',
					next: 'Next',
					markAsRead: 'Mark as read',
					retry: 'Retry',
					confirm: 'Confirm'
				},
				labels: {
					page: 'Page',
					category: 'Category',
					date: 'Date',
					time: 'Time',
					noRecords: 'No records at the moment',
					create: 'Create',
					confirmAction: 'Confirm action',
					nameActivity: 'Activity',
					nameTransaction: 'Transaction',
					nameTask: 'Task',
					nameHabit: 'Habit'
				},
				alert: {
					success: {
						create: 'Saved successfully',
						update: 'Updated successfully',
						delete: 'Deleted successfully'
					}
				},
				errorMessages: {
					UNEXPECTED_ERROR: 'An unexpected error has occurred. Try it again'
				}
			}
		},
		es: {
			translation: {
				auth: {
					tittleSignUp: 'Registrar cuenta',
					tittleSignIn: 'Inicia sesión en tu cuenta',
					notMember: '¿Aún no tienes una cuenta?',
					goSignUp: 'Regístrese aquí.',
					personalInfo: 'Información personal',
					nickname: 'Apodo',
					emailAddress: 'Correo electrónico',
					password: 'Contraseña',
					repeatPassword: 'Repetir contraseña',
					location: 'Ubicación',
					chooseAvatar: 'Elige tu avatar',
					btnSignUp: 'Registrarse',
					btnSignIn: 'Iniciar sesión',
					nicknamePlaceHolder: 'Elige tu nombre de usuario',
					emailAddressPlaceHolder: 'Tu@usuario.com',
					passwordPlaceHolder: 'Contraseña',
					repeatPasswordPlaceHolder: 'Repita la contraseña',
					hasAccountLabel: '¿Ya tienes una cuenta?',
					loginLinkText: 'Inicia sesión',
					goRessetPassword: '¿Has olvidado tu contraseña?',
					btnRessetPassword: 'Enviar',
					tittleRessetPassword: 'Restablecer contraseña',
					textRessetPasswordInstructions:
						'Ingrese su dirección de correo electrónico y le enviaremos instrucciones para restablecer su contraseña.',
					rememberPassword: '¿Recuerdas tu contraseña?',
					goBack: 'Volver atrás'
				},
				oauth: {
					title: 'Botsi GPT quiere conectarse a tu cuenta',
					text: 'Botsi GPT de ChatGPT desea poder acceder a sus datos y realizar operaciones.',
					question: '¿Permitir el acceso a Botsi GPT?',
					buttonText: 'Autorizar'
				},

				settings: {
					tittle: 'Configuraciones',
					description: 'Descripción',
					systemPrompts: {
						title: 'Prompts del Sistema',
						description: 'Description'
					},
					users: {
						title: 'Usuarios',
						description: 'Description'
					},
					agents: {
						title: 'Agentes',
						description: 'Description'
					},
					statistics: {
						title: 'Estadísticas',
						description: 'Description'
					},
					apiKeys: {
						title: 'Claves API',
						description: 'Description'
					}
				},
				buttons: {
					save: 'Guardar',
					cancel: 'Cancelar',
					delete: 'Eliminar',
					edit: 'Editar',
					view: 'Ver',
					update: 'Actualizar',
					previous: 'Anterior',
					next: 'Siguiente',
					markAsRead: 'Marcar como leído',
					retry: 'Reintentar',
					confirm: 'Confirmar'
				},
				labels: {
					page: 'Página',
					category: 'Categoría',
					date: 'Fecha',
					time: 'Hora',
					noRecords: 'No hay registros en este momento',
					create: 'Crear',
					confirmAction: 'Confirmar acción',
					nameActivity: 'Actividad',
					nameTransaction: 'Transacción',
					nameTask: 'Tarea',
					nameHabit: 'Hábito'
				},
				alert: {
					success: {
						create: 'Guardado exitosamente',
						update: 'Actualizado exitosamente',
						delete: 'Eliminado exitosamente'
					}
				},
				errorMessages: {
					UNEXPECTED_ERROR: 'Ha ocurrido un error inesperado. Intenatalo de nuevo'
				}
			}
		}
	},
	interpolation: {
		escapeValue: false
	}
});

// Sincroniza el cambio de idioma con localStorage
i18next.on('languageChanged', (lng) => {
	//localStorage.setItem('language', lng);
	languageStore.set(lng as LanguageCodeType);
});

export default () => createI18nStore(i18next);
