import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialData1684567391062 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT IGNORE INTO authors (id, name, email, bio, image) VALUES \n" +
        "(1, 'Rizhul Januar', 'rizhul@dev.com', 'bio 1', 'http://localhost'), \n" +
        "(2, 'Januar', 'januar@dev.com', 'bio 2', 'http://localhost')"
    );

    await queryRunner.query(
      "INSERT IGNORE INTO books (id, title, description, price, authorId, category) VALUES \n" +
        "(1, 'The Alchemist', 'A book about following your dreams', 120000, 1, 'Fiction'), \n" +
        "(2, 'The Subtle Art of Not Giving a F*ck', 'A book about learning to prioritize your values', 199000, 2, 'Self-help')"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM authors`);
    await queryRunner.query(`DELETE FROM books`);
  }
}
