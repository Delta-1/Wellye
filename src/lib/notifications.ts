import { Capacitor } from "@capacitor/core";
export async function configureReminder(enabled: boolean, time: string) {
  if (Capacitor.isNativePlatform()) {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );
    await LocalNotifications.cancel({ notifications: [{ id: 701 }] });
    if (!enabled) return;
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== "granted")
      throw new Error("Autorize as notificações nas configurações do celular.");
    const [hour, minute] = time.split(":").map(Number);
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 701,
          title: "Um passo de cada vez 💜",
          body: "Seu plano no Wellye está pronto. Que tal alguns minutos para você?",
          schedule: { on: { hour, minute }, allowWhileIdle: true },
        },
      ],
    });
    return;
  }
  if (enabled) {
    if (!("Notification" in window))
      throw new Error(
        "Este navegador não oferece notificações. Seu horário ficará salvo no perfil.",
      );
    const p = await Notification.requestPermission();
    if (p !== "granted")
      throw new Error(
        "Permita notificações no navegador para ativar o lembrete.",
      );
  }
}
