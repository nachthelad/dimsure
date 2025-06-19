"use client"

import { Shield, Lock, Users, Database, UserCheck, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"

export default function PrivacyPage() {
  const { t, locale } = useLanguage()

  // Debug: Let's see what's happening
  console.log("Current locale:", locale)
  console.log("Privacy title translation:", t("privacy.title"))

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {locale === "es" ? "Política de Privacidad" : "Privacy Policy"}
        </h1>
        <p className="text-xl text-muted-foreground">
          {locale === "es"
            ? "Tu privacidad y protección de datos son importantes para nosotros."
            : "Your privacy and data protection are important to us."}
        </p>
        <Badge variant="outline" className="mt-4">
          {locale === "es" ? "Última actualización:" : "Last updated:"} {new Date().toLocaleDateString()}
        </Badge>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {locale === "es" ? "Introducción" : "Introduction"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {locale === "es"
                ? 'Dimsure ("nosotros", "nuestro" o "nos") está comprometido a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando usas nuestro sitio web y servicios.'
                : 'Dimsure ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.'}
            </p>
            <p className="text-muted-foreground">
              {locale === "es"
                ? "Al usar Dimsure, aceptas la recopilación y uso de información de acuerdo con esta política."
                : "By using Dimsure, you agree to the collection and use of information in accordance with this policy."}
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              {locale === "es" ? "Información que Recopilamos" : "Information We Collect"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">
                {locale === "es" ? "Información Personal" : "Personal Information"}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Google Account Data:</strong>{" "}
                  {locale === "es"
                    ? "Nombre, dirección de email y foto de perfil cuando inicias sesión con Google"
                    : "Name, email address, and profile picture when you sign in with Google"}
                </li>
                <li>
                  • <strong>Username:</strong>{" "}
                  {locale === "es"
                    ? "Nombre de usuario personalizado que eliges para tu perfil público"
                    : "Custom username you choose for your public profile"}
                </li>
                <li>
                  • <strong>Product Contributions:</strong>{" "}
                  {locale === "es"
                    ? "Datos de productos, dimensiones y descripciones que envías"
                    : "Product data, dimensions, and descriptions you submit"}
                </li>
                <li>
                  • <strong>User Interactions:</strong>{" "}
                  {locale === "es"
                    ? "Me gusta, visualizaciones, comentarios y otras actividades en la plataforma"
                    : "Likes, views, comments, and other platform activities"}
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">
                {locale === "es" ? "Información Recopilada Automáticamente" : "Automatically Collected Information"}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Usage Data:</strong>{" "}
                  {locale === "es"
                    ? "Páginas visitadas, tiempo transcurrido e interacciones del usuario"
                    : "Pages visited, time spent, and user interactions"}
                </li>
                <li>
                  • <strong>Device Information:</strong>{" "}
                  {locale === "es"
                    ? "Tipo de navegador, sistema operativo e identificadores del dispositivo"
                    : "Browser type, operating system, and device identifiers"}
                </li>
                <li>
                  • <strong>IP Address:</strong>{" "}
                  {locale === "es" ? "Para propósitos de seguridad y análisis" : "For security and analytics purposes"}
                </li>
                <li>
                  • <strong>Cookies:</strong>{" "}
                  {locale === "es"
                    ? "Para mejorar tu experiencia y recordar preferencias"
                    : "To enhance your experience and remember preferences"}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              {locale === "es" ? "Cómo Usamos tu Información" : "How We Use Your Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • <strong>Account Management:</strong>{" "}
                {locale === "es" ? "Crear y gestionar tu cuenta de usuario" : "Create and manage your user account"}
              </li>
              <li>
                • <strong>Service Provision:</strong>{" "}
                {locale === "es"
                  ? "Permitirte contribuir y acceder a datos de dimensiones de productos"
                  : "Enable you to contribute and access product dimension data"}
              </li>
              <li>
                • <strong>Attribution:</strong>{" "}
                {locale === "es"
                  ? "Mostrar tus contribuciones con tu nombre de usuario elegido"
                  : "Display your contributions with your chosen username"}
              </li>
              <li>
                • <strong>Communication:</strong>{" "}
                {locale === "es"
                  ? "Enviar actualizaciones importantes sobre nuestro servicio"
                  : "Send important updates about our service"}
              </li>
              <li>
                • <strong>Analytics:</strong>{" "}
                {locale === "es"
                  ? "Entender patrones de uso para mejorar nuestra plataforma"
                  : "Understand usage patterns to improve our platform"}
              </li>
              <li>
                • <strong>Security:</strong>{" "}
                {locale === "es"
                  ? "Proteger contra fraude y acceso no autorizado"
                  : "Protect against fraud and unauthorized access"}
              </li>
              <li>
                • <strong>Legal Compliance:</strong>{" "}
                {locale === "es"
                  ? "Cumplir obligaciones legales y hacer cumplir nuestros términos"
                  : "Meet legal obligations and enforce our terms"}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {locale === "es" ? "Cómo Compartimos tu Información" : "How We Share Your Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 font-semibold">
                {locale === "es"
                  ? "🛡️ NO vendemos tus datos personales a terceros."
                  : "🛡️ We DO NOT sell your personal data to third parties."}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">
                {locale === "es" ? "Servicios de Terceros" : "Third-Party Services"}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Google:</strong>{" "}
                  {locale === "es" ? "Servicios de autenticación y análisis" : "Authentication services and analytics"}
                </li>
                <li>
                  • <strong>Firebase:</strong>{" "}
                  {locale === "es" ? "Servicios de base de datos y hosting" : "Database and hosting services"}
                </li>
                <li>
                  • <strong>Vercel:</strong>{" "}
                  {locale === "es" ? "Hosting y despliegue del sitio web" : "Website hosting and deployment"}
                </li>
                <li>
                  • <strong>Google AdSense:</strong>{" "}
                  {locale === "es"
                    ? "Servicios de publicidad (solo datos anonimizados)"
                    : "Advertising services (anonymized data only)"}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">{locale === "es" ? "Información Pública" : "Public Information"}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  •{" "}
                  {locale === "es"
                    ? "Tu nombre de usuario y contribuciones de productos son públicamente visibles"
                    : "Your username and product contributions are publicly visible"}
                </li>
                <li>
                  •{" "}
                  {locale === "es"
                    ? "Los datos de productos que envías se convierten en parte de nuestra base de datos pública"
                    : "Product data you submit becomes part of our public database"}
                </li>
                <li>
                  •{" "}
                  {locale === "es"
                    ? "Los comentarios e interacciones en productos se muestran públicamente"
                    : "Comments and interactions on products are publicly displayed"}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {locale === "es" ? "Seguridad de Datos" : "Data Security"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • <strong>Encryption:</strong>{" "}
                {locale === "es"
                  ? "Todos los datos están cifrados en tránsito y en reposo"
                  : "All data is encrypted in transit and at rest"}
              </li>
              <li>
                • <strong>Access Control:</strong>{" "}
                {locale === "es"
                  ? "Acceso limitado a datos personales según necesidad"
                  : "Limited access to personal data on a need-to-know basis"}
              </li>
              <li>
                • <strong>Google Security:</strong>{" "}
                {locale === "es"
                  ? "Aprovechamos la infraestructura de seguridad empresarial de Google"
                  : "We leverage Google's enterprise-grade security infrastructure"}
              </li>
              <li>
                • <strong>Regular Updates:</strong>{" "}
                {locale === "es"
                  ? "Las medidas de seguridad se actualizan y monitorean continuamente"
                  : "Security measures are continuously updated and monitored"}
              </li>
              <li>
                • <strong>Data Minimization:</strong>{" "}
                {locale === "es"
                  ? "Solo recopilamos datos necesarios para nuestros servicios"
                  : "We only collect data necessary for our services"}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              {locale === "es" ? "Tus Derechos y Opciones" : "Your Rights and Choices"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">{locale === "es" ? "Gestión de Cuenta" : "Account Management"}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Access:</strong>{" "}
                  {locale === "es" ? "Ver y descargar tus datos personales" : "View and download your personal data"}
                </li>
                <li>
                  • <strong>Correction:</strong>{" "}
                  {locale === "es" ? "Actualizar o corregir tu información" : "Update or correct your information"}
                </li>
                <li>
                  • <strong>Deactivation:</strong>{" "}
                  {locale === "es"
                    ? "Desactivar tu cuenta (datos preservados para reactivación)"
                    : "Deactivate your account (data preserved for reactivation)"}
                </li>
                <li>
                  • <strong>Username Changes:</strong>{" "}
                  {locale === "es" ? "Modificar tu nombre de usuario público" : "Modify your public username"}
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>{locale === "es" ? "Nota:" : "Note:"}</strong>{" "}
                {locale === "es"
                  ? "Las contribuciones de productos pueden permanecer en nuestra base de datos incluso después de la desactivación de la cuenta para mantener la integridad de datos para la comunidad. Tu nombre de usuario será anonimizado si eliges eliminar permanentemente tu cuenta."
                  : "Product contributions may remain in our database even after account deactivation to maintain data integrity for the community. Your username will be anonymized if you choose to permanently delete your account."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>{locale === "es" ? "Contáctanos" : "Contact Us"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {locale === "es"
                ? "Si tienes alguna pregunta sobre esta Política de Privacidad o nuestras prácticas de datos, por favor contáctanos:"
                : "If you have any questions about this Privacy Policy or our data practices, please contact us:"}
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold">{locale === "es" ? "Email:" : "Email:"}</p>
              <p className="text-muted-foreground">privacy@dimsure.com</p>
              <p className="font-semibold mt-2">{locale === "es" ? "Línea de Asunto:" : "Subject Line:"}</p>
              <p className="text-muted-foreground">
                {locale === "es"
                  ? "Pregunta sobre Política de Privacidad - Dimsure"
                  : "Privacy Policy Question - Dimsure"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
