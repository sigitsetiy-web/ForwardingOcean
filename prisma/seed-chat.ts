import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://postgres:Bismillah%40123Pass@db.ikhxkdmnnwekacuesoyy.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding inter-user chat conversations...\n");

  // Get all users
  const users = await prisma.user.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  if (users.length < 2) throw new Error("Need at least 2 users");

  const admin = users.find((u) => u.role === "OWNER");
  const budi = users.find((u) => u.email === "budi@keyocean.co.id");
  const siti = users.find((u) => u.email === "siti@keyocean.co.id");
  const rudi = users.find((u) => u.email === "rudi@keyocean.co.id");
  const lisa = users.find((u) => u.email === "lisa@keyocean.co.id");
  const andi = users.find((u) => u.email === "andi@keyocean.co.id");

  if (!admin || !budi || !siti || !rudi || !lisa) {
    throw new Error("Some users missing. Run base seed first.");
  }

  // 1. Create Operations channel with all ops staff
  const opsChannel = await prisma.chatRoom.create({
    data: {
      type: "channel",
      name: "# operasional",
      description: "Channel operasional untuk koordinasi JO",
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id, userName: admin.name, role: "owner" },
          { userId: budi.id, userName: budi.name, role: "admin" },
          { userId: siti.id, userName: siti.name, role: "member" },
          { userId: rudi.id, userName: rudi.name, role: "member" },
        ],
      },
    },
  });

  // Add messages to ops channel
  const opsMessages = [
    { senderId: admin.id, senderName: admin.name, content: "Tim, semua JO bulan Juni sudah masuk sistem. Tolong pantau progressnya.", type: "text" },
    { senderId: budi.id, senderName: budi.name, content: "Siap pak. JO PT Maju Bersama dan PT Sentosa Motor akan saya follow up hari ini.", type: "text" },
    { senderId: siti.id, senderName: siti.name, content: "Untuk PT Nusantara Seafood, reefer container sudah confirmed di Maersk. ETD 15 Juni.", type: "text" },
    { senderId: rudi.id, senderName: rudi.name, content: "Customs clearance PT Surya Logistik jalur kuning, kemungkinan 2-3 hari prosesnya.", type: "text" },
    { senderId: admin.id, senderName: admin.name, content: "Ok. Rudi, tolong update milestone di sistem begitu SPPB terbit ya.", type: "text" },
    { senderId: rudi.id, senderName: rudi.name, content: "Baik pak, akan saya update.", type: "text" },
    { senderId: siti.id, senderName: siti.name, content: "PT Global Ekspor - furniture sudah naik vessel NYK VENUS tadi pagi. Semua dokumen clear.", type: "text" },
    { senderId: budi.id, senderName: budi.name, content: "Good. Siti tolong kirim copy B/L ke customer ya secepatnya.", type: "text" },
  ];

  for (let i = 0; i < opsMessages.length; i++) {
    await prisma.chatMessage.create({
      data: {
        roomId: opsChannel.id,
        ...opsMessages[i],
        createdAt: new Date(Date.now() - (opsMessages.length - i) * 600000), // 10 min apart
      },
    });
  }
  console.log("  Created # operasional channel with " + opsMessages.length + " messages");

  // 2. Create Finance channel
  const finChannel = await prisma.chatRoom.create({
    data: {
      type: "channel",
      name: "# keuangan",
      description: "Channel keuangan untuk billing & payment",
      createdById: lisa.id,
      members: {
        create: [
          { userId: admin.id, userName: admin.name, role: "member" },
          { userId: lisa.id, userName: lisa.name, role: "owner" },
          { userId: budi.id, userName: budi.name, role: "member" },
        ],
      },
    },
  });

  const finMessages = [
    { senderId: lisa.id, senderName: lisa.name, content: "Invoice INV-2026-0001 PT Maju Bersama sudah PAID. Transfer masuk tadi sore." },
    { senderId: admin.id, senderName: admin.name, content: "Bagus Lisa. Bagaimana dengan PT Global Ekspor?" },
    { senderId: lisa.id, senderName: lisa.name, content: "INV-2026-0002 juga sudah lunas. Sisa INV-0003 dan 0004 masih outstanding." },
    { senderId: lisa.id, senderName: lisa.name, content: "Untuk vendor AP, Evergreen Line dan NYK Line sudah dibayar. Sisanya menunggu approval." },
    { senderId: budi.id, senderName: budi.name, content: "Lisa, tolong remind PT Surya Logistik untuk pembayaran invoice-nya ya. Sudah jatuh tempo minggu depan." },
    { senderId: lisa.id, senderName: lisa.name, content: "Siap pak Budi, akan saya follow up via email dan telepon." },
  ];

  for (let i = 0; i < finMessages.length; i++) {
    await prisma.chatMessage.create({
      data: {
        roomId: finChannel.id,
        senderId: finMessages[i].senderId,
        senderName: finMessages[i].senderName,
        content: finMessages[i].content,
        type: "text",
        createdAt: new Date(Date.now() - (finMessages.length - i) * 900000),
      },
    });
  }
  console.log("  Created # keuangan channel with " + finMessages.length + " messages");

  // 3. Create DM between Admin and Budi
  const dmAdminBudi = await prisma.chatRoom.create({
    data: {
      type: "dm",
      name: admin.name + " & " + budi.name,
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id, userName: admin.name },
          { userId: budi.id, userName: budi.name },
        ],
      },
    },
  });

  const dmMessages1 = [
    { senderId: admin.id, senderName: admin.name, content: "Budi, untuk JO PT Sentosa Motor yang jalur merah, bagaimana perkembangan pemeriksaan fisiknya?" },
    { senderId: budi.id, senderName: budi.name, content: "Masih proses pak. Petugas bea cukai baru jadwalkan pemeriksaan hari Kamis." },
    { senderId: admin.id, senderName: admin.name, content: "Ok. Pastikan PPJK kita standby ya. Kalau ada temuan, langsung koordinasi dengan saya." },
    { senderId: budi.id, senderName: budi.name, content: "Siap pak. Saya sudah brief PPJK Anugerah untuk prepare semua dokumen pendukung." },
    { senderId: admin.id, senderName: admin.name, content: "Good. Update saya begitu ada hasil pemeriksaan." },
  ];

  for (let i = 0; i < dmMessages1.length; i++) {
    await prisma.chatMessage.create({
      data: {
        roomId: dmAdminBudi.id,
        senderId: dmMessages1[i].senderId,
        senderName: dmMessages1[i].senderName,
        content: dmMessages1[i].content,
        type: "text",
        createdAt: new Date(Date.now() - (dmMessages1.length - i) * 300000),
      },
    });
  }
  console.log("  Created DM Admin-Budi with " + dmMessages1.length + " messages");

  // 4. Create DM between Siti and Rudi
  const dmSitiRudi = await prisma.chatRoom.create({
    data: {
      type: "dm",
      name: siti.name + " & " + rudi.name,
      createdById: siti.id,
      members: {
        create: [
          { userId: siti.id, userName: siti.name },
          { userId: rudi.id, userName: rudi.name },
        ],
      },
    },
  });

  const dmMessages2 = [
    { senderId: siti.id, senderName: siti.name, content: "Rudi, B/L untuk JO PT Maju Bersama sudah ada. Bisa proses customs-nya?" },
    { senderId: rudi.id, senderName: rudi.name, content: "Ok Siti, kirim softcopy-nya ke saya ya. Besok pagi saya daftarkan PIB-nya." },
    { senderId: siti.id, senderName: siti.name, content: "Sudah saya upload di sistem (tab Dokumen). Cek di JO SMG-IMP-202606-0001." },
    { senderId: rudi.id, senderName: rudi.name, content: "Got it. Thanks Siti! Besok saya update statusnya." },
  ];

  for (let i = 0; i < dmMessages2.length; i++) {
    await prisma.chatMessage.create({
      data: {
        roomId: dmSitiRudi.id,
        senderId: dmMessages2[i].senderId,
        senderName: dmMessages2[i].senderName,
        content: dmMessages2[i].content,
        type: "text",
        createdAt: new Date(Date.now() - (dmMessages2.length - i) * 450000),
      },
    });
  }
  console.log("  Created DM Siti-Rudi with " + dmMessages2.length + " messages");

  // 5. Create JO Thread for PT Sentosa Motor (the one in progress)
  const joInProgress = await prisma.jobOrder.findFirst({ where: { status: "IN_PROGRESS" } });
  if (joInProgress) {
    const joThread = await prisma.chatRoom.create({
      data: {
        type: "jo-thread",
        name: joInProgress.number + " - PT Sentosa Motor",
        description: "Thread diskusi untuk JO " + joInProgress.number,
        jobOrderId: joInProgress.id,
        createdById: admin.id,
        members: {
          create: [
            { userId: admin.id, userName: admin.name, role: "owner" },
            { userId: budi.id, userName: budi.name, role: "member" },
            { userId: rudi.id, userName: rudi.name, role: "member" },
          ],
        },
      },
    });

    const joMessages = [
      { senderId: rudi.id, senderName: rudi.name, content: "PIB sudah didaftarkan. Tapi jalur MERAH, harus pemeriksaan fisik." },
      { senderId: budi.id, senderName: budi.name, content: "Waduh. Perkiraan berapa lama prosesnya Rud?" },
      { senderId: rudi.id, senderName: rudi.name, content: "Biasanya 3-5 hari kerja. Saya coba push ke petugas supaya bisa lebih cepat." },
      { senderId: admin.id, senderName: admin.name, content: "Info ke customer bahwa ada delay karena pemeriksaan fisik. Jaga komunikasi." },
      { senderId: budi.id, senderName: budi.name, content: "Baik pak. Saya akan telpon Pak Wawan (PIC PT Sentosa) hari ini." },
      { senderId: rudi.id, senderName: rudi.name, content: "Update: Petugas sudah jadwalkan pemeriksaan Kamis, 26 Juni jam 10 pagi." },
    ];

    for (let i = 0; i < joMessages.length; i++) {
      await prisma.chatMessage.create({
        data: {
          roomId: joThread.id,
          senderId: joMessages[i].senderId,
          senderName: joMessages[i].senderName,
          content: joMessages[i].content,
          type: "text",
          createdAt: new Date(Date.now() - (joMessages.length - i) * 1800000),
        },
      });
    }
    console.log("  Created JO Thread for " + joInProgress.number + " with " + joMessages.length + " messages");
  }

  // Also add all users to General room
  const generalRoom = await prisma.chatRoom.findFirst({ where: { name: "# general" } });
  if (generalRoom) {
    for (const u of [budi, siti, rudi, lisa]) {
      const existing = await prisma.chatMember.findFirst({ where: { roomId: generalRoom.id, userId: u.id } });
      if (!existing) {
        await prisma.chatMember.create({ data: { roomId: generalRoom.id, userId: u.id, userName: u.name } });
      }
    }
    // Add more messages to general
    const genMsgs = [
      { senderId: budi.id, senderName: budi.name, content: "Good morning team! Ready for another productive week." },
      { senderId: siti.id, senderName: siti.name, content: "Morning! Ada update rate baru dari Evergreen untuk Juli. Nanti saya share." },
      { senderId: lisa.id, senderName: lisa.name, content: "Reminder: Closing pembukuan Juni tanggal 30. Mohon semua AP/AR sudah diinput sebelum deadline." },
      { senderId: rudi.id, senderName: rudi.name, content: "Noted Lisa. Saya pastikan customs cost semua JO Juni sudah masuk." },
    ];
    for (let i = 0; i < genMsgs.length; i++) {
      await prisma.chatMessage.create({
        data: {
          roomId: generalRoom.id,
          senderId: genMsgs[i].senderId,
          senderName: genMsgs[i].senderName,
          content: genMsgs[i].content,
          type: "text",
          createdAt: new Date(Date.now() - (genMsgs.length - i) * 1200000),
        },
      });
    }
    console.log("  Added messages to # general");
  }

  console.log("\n Chat seeding complete!");
  console.log("  - # operasional (8 messages)");
  console.log("  - # keuangan (6 messages)");
  console.log("  - DM Admin-Budi (5 messages)");
  console.log("  - DM Siti-Rudi (4 messages)");
  console.log("  - JO Thread PT Sentosa (6 messages)");
  console.log("  - # general (4 new messages)");
}

main()
  .catch((e) => { console.error("Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
