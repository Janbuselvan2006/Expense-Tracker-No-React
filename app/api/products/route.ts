import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create a connection pool to MySQL
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'expense_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET all products
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    return NextResponse.json(rows);
  } catch (error: any) {
    // If table doesn't exist, provide a helpful error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return NextResponse.json({ error: 'Table "products" does not exist. Please run the database setup script.' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, oldPrice, category, qty, description } = body;
    
    const [result]: any = await pool.query(
      'INSERT INTO products (name, price, oldPrice, category, qty, description, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, price, oldPrice || null, category || null, qty || null, description || null, true]
    );
    
    return NextResponse.json({ id: result.insertId, ...body }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
