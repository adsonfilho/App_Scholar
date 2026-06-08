import { PrismaClient, Role, CoursePeriod, Situation } from '@prisma/client';
import * as bcrypt from '../src/lib/bcrypt';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 Iniciando a limpeza e semeio completo da base de dados com Invitations...');

  const hashedPassword = await bcrypt.hashPassword('senha123');

  // ==========================================
  // 1. POPULANDO AS TITULAÇÕES (Degrees)
  // ==========================================
  console.log('Inserting degrees...');
  const degreesData = [{ name: 'Especialização / MBA' }, { name: 'Mestrado' }, { name: 'Doutorado' }, { name: 'Pós-Doutorado' }];
  const degrees: any = {};
  for (const item of degreesData) {
    const d = await prisma.degree.upsert({
      where: { name: item.name },
      update: {},
      create: { name: item.name }
    });
    degrees[item.name] = d;
  }

  // ==========================================
  // 2. POPULANDO AS ÁREAS DE ATUAÇÃO (Fields)
  // ==========================================
  console.log('Inserting fields...');
  const fieldsData = [
    { name: 'Programação e Engenharia de Software' },
    { name: 'Banco de Dados e Infraestrutura' },
    { name: 'Inteligência Artificial e Ciência de Dados' },
    { name: 'Gestão de Negócios e Projetos' },
    { name: 'Redes de Computadores e Segurança' }
  ];
  const fields: any = {};
  for (const item of fieldsData) {
    const f = await prisma.field.upsert({
      where: { name: item.name },
      update: {},
      create: { name: item.name }
    });
    fields[item.name] = f;
  }

  // ==========================================
  // 3. POPULANDO OS CURSOS (Courses)
  // ==========================================
  console.log('Inserting courses...');
  const coursesData = [
    { name: 'Desenvolvimento de Software Multiplataforma', acronym: 'DSM', coursePeriod: CoursePeriod.EVENING },
    { name: 'Análise e Desenvolvimento de Sistemas', acronym: 'ADS', coursePeriod: CoursePeriod.MORNING },
    { name: 'Gestão Empresarial', acronym: 'GE', coursePeriod: CoursePeriod.EVENING },
    { name: 'Logística', acronym: 'LOG', coursePeriod: CoursePeriod.AFTERNOON },
    { name: 'Segurança da Informação', acronym: 'SI', coursePeriod: CoursePeriod.EVENING }
  ];
  const courses: any = {};
  for (const item of coursesData) {
    const c = await prisma.course.upsert({
      where: { acronym: item.acronym },
      update: {},
      create: { name: item.name, acronym: item.acronym, coursePeriod: item.coursePeriod }
    });
    courses[item.acronym] = c;
  }

  // ==========================================
  // 4. POPULANDO PROFESSORES
  // ==========================================
  console.log('Inserting professors...');
  const professorsData = [
    { name: 'Carlos Alberto Silva', email: 'carlos.silva@fatec.sp.gov.br', degreeName: 'Doutorado', fieldName: 'Programação e Engenharia de Software', experience: 120 },
    { name: 'Ana Maria Junqueira', email: 'ana.junqueira@fatec.sp.gov.br', degreeName: 'Mestrado', fieldName: 'Banco de Dados e Infraestrutura', experience: 72 },
    { name: 'Patrícia Mendes', email: 'patricia.mendes@fatec.sp.gov.br', degreeName: 'Especialização / MBA', fieldName: 'Gestão de Negócios e Projetos', experience: 48 }
  ];
  const professors: any[] = [];
  for (const prof of professorsData) {
    const user = await prisma.user.upsert({
      where: { email: prof.email },
      update: {},
      create: { name: prof.name, email: prof.email, password: hashedPassword, role: Role.PROFESSOR }
    });
    const professor = await prisma.professor.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, degreeId: degrees[prof.degreeName].id, fieldId: fields[prof.fieldName].id, teachingExperience: prof.experience }
    });
    professors.push(professor);
  }

  // Admin global
  await prisma.user.upsert({
    where: { email: 'admin@fatec.sp.gov.br' },
    update: {},
    create: { name: 'Admin AppScholar', email: 'admin@fatec.sp.gov.br', password: hashedPassword, role: Role.ADMIN }
  });

  // ==========================================
  // 5. POPULANDO AS DISCIPLINAS (Subjects)
  // ==========================================
  console.log('Inserting subjects...');
  const subjectsData = [
    { name: 'Estrutura de Dados', workload: 80, semester: 2, courseAcronym: 'DSM', profIndex: 0 },
    { name: 'Desenvolvimento Web Multiplataforma', workload: 80, semester: 3, courseAcronym: 'DSM', profIndex: 0 },
    { name: 'Banco de Dados Relacional', workload: 80, semester: 2, courseAcronym: 'DSM', profIndex: 1 },
    { name: 'Algoritmos e Lógica de Programação', workload: 80, semester: 1, courseAcronym: 'ADS', profIndex: 0 },
    { name: 'Engenharia de Software I', workload: 80, semester: 2, courseAcronym: 'ADS', profIndex: 2 }
  ];

  const subjects: any[] = [];
  for (const sub of subjectsData) {
    const courseId = courses[sub.courseAcronym].id;
    const professorId = professors[sub.profIndex].id;

    let subject = await prisma.subject.findFirst({
      where: { name: sub.name, courseId: courseId }
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: sub.name, workload: sub.workload, semester: sub.semester, courseId, professorId }
      });
    }
    subjects.push(subject);
  }

  // ==========================================
  // 6. POPULANDO CONVITES, ALUNOS E NOTAS
  // ==========================================
  console.log('Inserting invitations, students and their grades...');
  const studentsData = [
    { name: 'Adson Ottoni', email: 'adson.aluno@fatec.sp.gov.br', enrollment: '123456789', courseAcronym: 'DSM', phone: '12999999999', address: 'Av. Humberto de Alencar Castelo Branco', number: '250', neighborhood: 'Vila Branca', city: 'Jacareí', state: 'SP', zipCode: '12312300' },
    { name: 'Lucas Gabriel Costa', email: 'lucas.aluno@fatec.sp.gov.br', enrollment: '987654321', courseAcronym: 'DSM', phone: '12988888888', address: 'Rua das Flores', number: '12', neighborhood: 'Centro', city: 'Jacareí', state: 'SP', zipCode: '12300000' },
    { name: 'Mariana Souza Santos', email: 'mariana.aluna@fatec.sp.gov.br', enrollment: '456123789', courseAcronym: 'ADS', phone: '11977777777', address: 'Av. Paulista', number: '1000', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP', zipCode: '01310100' }
  ];

  for (const stu of studentsData) {
    const currentCourseId = courses[stu.courseAcronym].id;

    // AQUI: Cria o registro na tabela de convite primeiro para manter a consistência da regra de negócio
    await prisma.userInvitation.upsert({
      where: { email: stu.email }, // ou enrollment, já que ambos são únicos
      update: {},
      create: {
        enrollment: stu.enrollment,
        email: stu.email,
        role: Role.STUDENT,
        courseId: currentCourseId,
        usedAt: new Date() // Seta como usado, pois o aluno já existirá
      }
    });

    // 1. Cria o Usuário do tipo Aluno
    const user = await prisma.user.upsert({
      where: { email: stu.email },
      update: {},
      create: { name: stu.name, email: stu.email, password: hashedPassword, role: Role.STUDENT }
    });

    // 2. Cria os detalhes do Aluno
    const student = await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        enrollment: stu.enrollment,
        courseId: currentCourseId,
        phone: stu.phone,
        address: stu.address,
        number: stu.number,
        neighborhood: stu.neighborhood,
        city: stu.city,
        state: stu.state,
        zipCode: stu.zipCode
      }
    });

    // 3. Vincular Notas automáticas baseado no curso que o aluno está matriculado
    const studentSubjects = subjects.filter(s => s.courseId === student.courseId);

    for (const sub of studentSubjects) {
      let g1 = stu.courseAcronym === 'DSM' && stu.name.startsWith('Adson') ? 8.5 : 5.0;
      let g2 = stu.courseAcronym === 'DSM' && stu.name.startsWith('Adson') ? 9.0 : 4.5;
      let average = (g1 + g2) / 2;
      let situation: Situation = average >= 6.0 ? Situation.PASSED : Situation.FAILED;

      await prisma.grade.upsert({
        where: {
          studentId_subjectId: { studentId: student.id, subjectId: sub.id }
        },
        update: {},
        create: {
          studentId: student.id,
          subjectId: sub.id,
          grade1: g1,
          grade2: g2,
          average: average,
          situation: situation
        }
      });
    }
  }

  console.log('🏁 Base de dados semeada e amarrada com a tabela de Invitations!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro durante o processo de seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });