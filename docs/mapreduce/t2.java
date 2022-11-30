import java.io.IOException;
import java.util.*;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.ObjectWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class OperationCount {

  public static class LogMapper
       extends Mapper<Object, Text, Text, ObjectWritable>{

    private static ObjectWritable result = new ObjectWritable();
    private Text word = new Text();

    public void map(Object key, Text value, Context context
                    ) throws IOException, InterruptedException {
      String[] lines = value.toString().split("\n", 0);
      for (String line : lines) {
        String[] parts = line.split(",", 0);
        word.set(parts[1] + "," + parts[2]);
        ObjectWritable op = new ObjectWritable(parts[3] + parts[4]);
        result.set(op);
        context.write(word, result);
      }
    }
  }

  public static class MaxReducer
       extends Reducer<Text,ObjectWritable,IntWritable,ObjectWritable> {
    private IntWritable resultKey = new IntWritable();
    private ObjectWritable result = new ObjectWritable();

    public void reduce(Text key, Iterable<ObjectWritable> values,
                       Context context
                       ) throws IOException, InterruptedException {
      int sum = 0;
      HashMap<String, Integer> map = new HashMap<>();
      for (ObjectWritable val : values) {
        String key = (String)val.get();
        map.compute(key, (k, v) -> (v == null ? 0 : v) + 1);
        sum++;
      }
      resultKey.set(sum);
      result.set(new Pair(key.toString(), map))
      context.write(resultKey, result);
    }
  }

  public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    Job job = Job.getInstance(conf, "operation count");
    job.setJarByClass(OperationCount.class);
    job.setMapperClass(LogMapper.class);
    job.setCombinerClass(MaxReducer.class);
    job.setReducerClass(MaxReducer.class);
    job.setOutputKeyClass(Text.class);
    job.setOutputValueClass(IntWritable.class);
    FileInputFormat.addInputPath(job, new Path(args[0]));
    FileOutputFormat.setOutputPath(job, new Path(args[1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }
}